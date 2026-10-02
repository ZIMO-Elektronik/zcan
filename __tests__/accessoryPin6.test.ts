import {beforeEach, describe, expect, it} from '@jest/globals';
import {Buffer} from 'buffer';
import MX10 from '../src';
import {Direction, HluState, Message, MsgAccessoryPin6, MsgMode} from '../src';

const ownNid = 0x0100;
const nid = 0xd001; // StEin module 1
const hluWire = [0x01, 0xd0, 0x03, 0x02, 0x9a, 0x82]; // section 3, HLU type, encoded state 0x829a (L east, contact HALT)

let mx10: MX10;

const feed = (mode: number, pin: number, type: number, value: number) => {
	const payload = Buffer.from([nid & 0xff, nid >> 8, pin, type, value & 0xff, value >> 8]);
	mx10.accessory.parse(payload.length, 0x06, mode, nid, payload);
};

const collect = () => {
	const seen: MsgAccessoryPin6[] = [];
	const sub = mx10.accessory.onAccessoryPin6.subscribe((msg) => seen.push(msg));
	return {seen, sub};
};

describe('Accessory Pin6 (0x01.0x06) StEin HLU - offline', () => {
	beforeEach(() => {
		mx10 = new MX10(ownNid, 'test', 1);
	});

	it('encodeHlu/decodeHlu round-trip', () => {
		// hlu 0xA = L; dir per protocol docs: 1 = East, 2 = West; contact hlu 0x2 = HALT
		const state: HluState = {hlu: 0xA, dir: Direction.EAST, contact: {hlu: 0x2, dir: Direction.UNDEFINED}};
		expect(MsgAccessoryPin6.encodeHlu(state)).toBe(0x829a);
		expect(MsgAccessoryPin6.decodeHlu(0x829a)).toEqual(state);

		const noContact: HluState = {hlu: 0xE, dir: Direction.UNDEFINED};
		expect(MsgAccessoryPin6.encodeHlu(noContact)).toBe(0x008e);
		expect(MsgAccessoryPin6.decodeHlu(0x008e)).toEqual(noContact);
	});

	it('encodeHlu masks out-of-range hlu/dir inputs', () => {
		const raw = {hlu: 0x1a, dir: 5, contact: {hlu: 0x12, dir: 6}} as unknown as HluState;
		expect(MsgAccessoryPin6.encodeHlu(raw)).toBe(0xa29a);
		expect(MsgAccessoryPin6.decodeHlu(0xa29a)).toEqual({hlu: 0xA, dir: Direction.EAST,
			contact: {hlu: 0x2, dir: Direction.WEST}});
	});

	it('a CMD value beyond 0xFFFF is masked, not thrown', () => {
		const cmd = new MsgAccessoryPin6(MsgAccessoryPin6.header(MsgMode.CMD, nid), 3, MsgAccessoryPin6.TYPE_HLU, 0x123456);
		expect(() => cmd.udp(ownNid)).not.toThrow();
		expect(cmd.state).toBe(0x3456);
	});

	it('REQ frame carries nid, pin, type and DLC 4', () => {
		const req = new MsgAccessoryPin6(MsgAccessoryPin6.header(MsgMode.REQ, nid), 3, MsgAccessoryPin6.TYPE_HLU);
		expect(req.nid).toBe(nid);
		expect(req.pin).toBe(3);
		expect(req.type).toBe(0x02);
		expect(req.state).toBeUndefined();

		const buffer = req.udp(ownNid);
		expect(buffer.readUInt16LE(0)).toBe(4); // DLC
		expect(buffer.readUInt8(4)).toBe(0x01); // group
		expect(buffer.readUInt8(5)).toBe((0x06 << 2) | MsgMode.REQ);
		expect([...buffer.subarray(8)]).toEqual([0x01, 0xd0, 0x03, 0x02]);
	});

	it('CMD frame carries the encoded HLU and DLC 6', () => {
		const cmd = new MsgAccessoryPin6(MsgAccessoryPin6.header(MsgMode.CMD, nid), 3, MsgAccessoryPin6.TYPE_HLU, 0x829a);
		const buffer = cmd.udp(ownNid);
		expect(buffer.readUInt16LE(0)).toBe(6); // DLC
		expect(buffer.readUInt8(5)).toBe((0x06 << 2) | MsgMode.CMD);
		expect([...buffer.subarray(8)]).toEqual(hluWire);
	});

	it('parses a 6-byte EVT frame into MsgAccessoryPin6', () => {
		const {seen, sub} = collect();

		mx10.accessory.parse(6, 0x06, MsgMode.EVT, nid, Buffer.from(hluWire));

		expect(seen.length).toBe(1);
		expect(seen[0].nid).toBe(nid);
		expect(seen[0].pin).toBe(3);
		expect(seen[0].type).toBe(0x02);
		expect(seen[0].state).toBe(0x829a);
		sub.unsubscribe();
	});

	it('parsing a 4-byte REQ frame neither throws nor emits', () => {
		const {seen, sub} = collect();

		const payload = Buffer.from([0x01, 0xd0, 0x03, 0x02]);
		expect(() => mx10.accessory.parse(4, 0x06, MsgMode.REQ, nid, payload)).not.toThrow();
		expect(seen).toEqual([]);
		sub.unsubscribe();
	});

	it('a forwarded StEin reply keeps the module NID in the UDP header and still reaches parse', () => {
		mx10.mx10IP = '192.168.1.145';
		mx10.mx10NID = 0xc08b;
		const {seen, sub} = collect();

		const frame = Buffer.alloc(14);
		frame.writeUInt16LE(6, 0); // DLC
		frame.writeUInt16LE(0, 2);
		frame.writeUInt8(0x01, 4); // group
		frame.writeUInt8((0x06 << 2) | MsgMode.EVT, 5);
		frame.writeUInt16LE(nid, 6); // sender: StEin module NID, not the MX10's
		Buffer.from(hluWire).copy(frame, 8);

		const forwarded = mx10 as unknown as {readRawData: (message: Buffer, rinfo: {address: string}) => void};
		forwarded.readRawData(frame, {address: '192.168.1.145'});

		expect(seen.length).toBe(1);
		expect(seen[0].nid).toBe(nid);
		expect(seen[0].state).toBe(0x829a);
		sub.unsubscribe();
	});

	it('getAccessoryPin6 sends the REQ, ignores wrong pin/type replies and resolves on the match', async () => {
		const sent: Message[] = [];
		mx10.sendMsg = (msg: Message) => {
			sent.push(msg);
			feed(MsgMode.ACK, 0, MsgAccessoryPin6.TYPE_HLU, 0x829a); // wrong pin
			feed(MsgMode.ACK, 3, 0x01, 0x0000); // wrong type
			feed(MsgMode.ACK, 3, MsgAccessoryPin6.TYPE_HLU, 0x829a); // match
		};

		const rv = await mx10.accessory.getAccessoryPin6(nid, 3, MsgAccessoryPin6.TYPE_HLU);
		expect(rv?.state).toBe(0x829a);
		expect(sent.length).toBe(1);
		expect(sent[0].header.mode).toBe(MsgMode.REQ);
		expect((sent[0] as MsgAccessoryPin6).pin).toBe(3);
		expect((sent[0] as MsgAccessoryPin6).type).toBe(0x02);
	});

	it('setAccessoryPin6 sends the CMD and resolves on the ACK', async () => {
		const sent: Message[] = [];
		mx10.sendMsg = (msg: Message) => {
			sent.push(msg);
			feed(MsgMode.ACK, 3, MsgAccessoryPin6.TYPE_HLU, (msg as MsgAccessoryPin6).state ?? 0);
		};

		const rv = await mx10.accessory.setAccessoryPin6(nid, 3, MsgAccessoryPin6.TYPE_HLU, 0x829a);
		expect(rv?.state).toBe(0x829a);
		expect(sent.length).toBe(1);
		expect(sent[0].header.mode).toBe(MsgMode.CMD);
		expect([...sent[0].udp(ownNid).subarray(8)]).toEqual(hluWire);
	});

	it('a silent module times out: undefined after the window, one REQ per retry slot', async () => {
		const sent: Message[] = [];
		mx10.sendMsg = (msg: Message) => {sent.push(msg);};
		const started = Date.now();
		const rv = await mx10.accessory.getAccessoryPin6(nid, 3, MsgAccessoryPin6.TYPE_HLU);
		expect(rv).toBeUndefined();
		expect(Date.now() - started).toBeGreaterThanOrEqual(90); // window is 10 x 10 ms
		// tx runs on every even tick, including the final give-up tick: 20,18,...,2,0 = 11 REQs
		expect(sent.length).toBe(11);
	});

	it('setAccessoryPin6 ignores unsolicited EVT frames and resolves on the ACK', async () => {
		mx10.sendMsg = () => {
			feed(MsgMode.EVT, 3, MsgAccessoryPin6.TYPE_HLU, 0x008e); // concurrent broadcast carrying a different value
			feed(MsgMode.ACK, 3, MsgAccessoryPin6.TYPE_HLU, 0x829a); // the reply to our CMD
		};

		const rv = await mx10.accessory.setAccessoryPin6(nid, 3, MsgAccessoryPin6.TYPE_HLU, 0x829a);
		expect(rv?.state).toBe(0x829a);
	});
});

describe('Accessory Pin6 (0x01.0x06) StEin occupancy - offline', () => {
	beforeEach(() => {
		mx10 = new MX10(ownNid, 'test', 1);
	});

	it('getAccessoryPin6 with TYPE_OCCUPANCY sends a DLC 4 REQ', async () => {
		const sent: Message[] = [];
		mx10.sendMsg = (msg: Message) => {
			sent.push(msg);
			feed(MsgMode.ACK, 3, MsgAccessoryPin6.TYPE_OCCUPANCY, 0x1100);
		};

		const rv = await mx10.accessory.getAccessoryPin6(nid, 3, MsgAccessoryPin6.TYPE_OCCUPANCY);
		expect(rv!.state! >> 8).toBe(0x11); // SectionState.OCCUPIED_ON (the enum lives in the app now)
		expect(sent.length).toBe(1);
		expect(sent[0].header.mode).toBe(MsgMode.REQ);
		const buffer = sent[0].udp(ownNid);
		expect(buffer.readUInt16LE(0)).toBe(4); // DLC
		expect([...buffer.subarray(8)]).toEqual([0x01, 0xd0, 0x03, 0x01]);
	});
});

/* eslint-disable @typescript-eslint/no-unused-vars */
import {Subject} from 'rxjs';
import MX10 from '../MX10';
import {AccessoryPin4Data, AccessoryPortData} from '../common/models';
import {AccessoryMode, MsgMode} from '../common/enums';
import { Query } from '../docs_entrypoint';
import { MsgAccessoryMode, MsgAccessoryPin6 } from './accessoryMsg';
import {Buffer} from 'buffer';

/**
 *
 * @category Groups
 */
export default class AccessoryGroup
{
	public readonly onAccessoryMode = new Subject<MsgAccessoryMode>();
	public readonly onAccessoryPort = new Subject<AccessoryPortData>();
	public readonly onAccessoryPin4 = new Subject<AccessoryPin4Data>();
	public readonly onAccessoryPin6 = new Subject<MsgAccessoryPin6>();

	private modeQ: Query<MsgAccessoryMode> | undefined = undefined;

	private mx10: MX10;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	async getAccessoryMode(nid: number)
	{
		if(this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
			this.mx10.logInfo.next("mx10.getAccessoryMode: failed to acquire lock");
			return undefined;
		}
		this.modeQ = new Query(MsgAccessoryMode.header(MsgMode.REQ, nid), this.onAccessoryMode);
		this.modeQ.tx = ((header) => {
			const msg = new MsgAccessoryMode(header);
			this.mx10.logInfo.next('accMode query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modeQ.match = ((msg) => {
			this.mx10.logInfo.next('accMode query rx: ' + JSON.stringify(msg));
			return (msg.nid === nid);
		})
		const rv = await this.modeQ.run();
		this.mx10.logInfo.next("mx10.getAccessoryMode.rv: " + JSON.stringify(rv));
		this.modeQ = undefined;
		return rv;
	}

	async setAccessoryMode(nid: number, mode: AccessoryMode)
	{
		if(this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
			this.mx10.logInfo.next("mx10.setAccessoryMode: failed to acquire lock");
			return undefined;
		}
		this.modeQ = new Query(MsgAccessoryMode.header(MsgMode.CMD, nid), this.onAccessoryMode);
		this.modeQ.tx = ((header) => {
			const msg = new MsgAccessoryMode(header, mode);
			this.mx10.logInfo.next('accMode query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modeQ.match = ((msg) => {
			this.mx10.logInfo.next('accMode query rx: ' + JSON.stringify(msg));
			return (msg.nid === nid && msg.mode === mode);
		})
		const rv = await this.modeQ.run();
		this.mx10.logInfo.next("mx10.setAccessoryMode.rv: " + JSON.stringify(rv));
		this.modeQ = undefined;
		return rv;
	}

	private async pin6Query(mode: MsgMode, nid: number, pin: number, type: number, value?: number)
	{
		const msg = new MsgAccessoryPin6(MsgAccessoryPin6.header(mode, nid), pin, type, value);
		this.mx10.logInfo.next('accPin6 tx: ' + JSON.stringify(msg));
		const q = new Query(msg.header, this.onAccessoryPin6);
		q.tx = (() => this.mx10.sendMsg(msg));
		//a CMD is answered by an ACK; a REQ reply may be ACK or EVT
		q.match = ((rx) => rx.pin === pin && rx.type === type && (mode === MsgMode.REQ || rx.header.mode === MsgMode.ACK));
		//the reply travels LAN -> CAN -> StEin and back, the default ~25 ms window is too tight
		const rv = await q.run(10, 10);
		this.mx10.logInfo.next('accPin6 rv: ' + JSON.stringify(rv));
		return rv;
	}

	async getAccessoryPin6(nid: number, pin: number, type: number)
	{
		return this.pin6Query(MsgMode.REQ, nid, pin, type);
	}

	async setAccessoryPin6(nid: number, pin: number, type: number, value: number)
	{
		return this.pin6Query(MsgMode.CMD, nid, pin, type, value);
	}

	accessoryModeByNid(nid: number)
	{
		this.mx10.sendData(0x01, 0x01, [{value: nid, length: 2}], 0b00);
	}

	accessoryPortByNid(nid: number)
	{
		this.mx10.sendData(0x01, 0x02, [{value: nid, length: 2}, {value: 0, length: 2}], 0b00);
	}

	accessoryPortByPin(nid: number, pin: number, state: number)
	{
		this.mx10.sendData(0x01, 0x04,
			[{value: nid, length: 2}, {value: pin, length: 1}, {value: state, length: 1}], 0b01);
	}

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command) {
			case 0x01:
				this.parseAccessoryMode(size, mode, nid, buffer);
				break;
			case 0x02:
				this.parseAccessoryPort(size, mode, nid, buffer);
				break;
			case 0x04:
				this.parseAccessoryPin4(size, mode, nid, buffer);
				break;
			case 0x06:
				this.parseAccessoryPin6(size, mode, nid, buffer);
				break;
			default:
				this.mx10.logInfo.next('accessoryCommandGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
		}
	}

	parseAccessoryMode(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(this.onAccessoryMode.observed)
			this.onAccessoryMode.next(MsgAccessoryMode.fromBuffer(mode, buffer));

		// if (this.onAccessoryMode.observed) {
		// 	const deviceNID = buffer.readUInt16LE(0);
		// 	const mode = buffer.readUInt16LE(2);
		// 	let parsedMode: AccessoryMode;
		// 	switch (mode) {
		// 		case 1:
		// 			parsedMode = AccessoryMode.PAIRED;
		// 			break;
		// 		case 2:
		// 			parsedMode = AccessoryMode.SINGLE;
		// 			break;
		// 		default:
		// 			parsedMode = AccessoryMode.UNKNOWN;
		// 	}
		// 	if (deviceNID) {
		// 		this.onAccessoryMode.next({nid: deviceNID, mode: parsedMode});
		// 	}
		// }
	}

	parseAccessoryPort(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onAccessoryPort.observed) {
			const deviceNID = buffer.readUInt16LE(0);
			const type = buffer.readUInt16LE(2);
			const port = buffer.readUInt8(4); // only 1.st byte represents state of pins
			if (deviceNID) {
				this.onAccessoryPort.next({nid: deviceNID, type, port});
			}
		}
	}

	parseAccessoryPin4(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onAccessoryPin4.observed) {
			const deviceNID = buffer.readUInt16LE(0);
			const pin = buffer.readUInt8(2);
			const state = buffer.readUInt8(3);
			if (deviceNID) {
				this.onAccessoryPin4.next({nid: deviceNID, pin, state});
			}
		}
	}

	parseAccessoryPin6(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(mode === MsgMode.REQ || buffer.length < 6)
			return;
		if(this.onAccessoryPin6.observed)
			this.onAccessoryPin6.next(MsgAccessoryPin6.fromBuffer(mode, buffer));
	}
}

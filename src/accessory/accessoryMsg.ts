import { AccessoryMode, MsgMode } from "../common/enums";
import { Header, Message } from "../common/communication";
import {Buffer} from 'buffer';


export class MsgAccessoryMode extends Message
{
	public static header = (mode: MsgMode, nid: number) => {return {group: 0x1, cmd: 0x1, mode, nid}}
	public static log: (msg: string) => void = () => {};

	constructor(header: Header, mode?: number)
	{
		super(header);
		if(header.mode === MsgMode.REQ)
			return;
		super.push({value: mode ?? 0, length: 2});
	}
	get nid(): number {return this.header.nid || 0}
	get mode(): number {return this.data[0].value as AccessoryMode;}

	public static fromBuffer(mode: MsgMode, buffer: Buffer)
	{
		const nid = buffer.readUInt16LE(0);
		const accMode = buffer.readUInt16LE(2);
		const msg = new MsgAccessoryMode(MsgAccessoryMode.header(mode, nid), accMode);
		return msg;
	}
}

// hlu state of one HLU byte / word half; naming of the values is the consumer's business
export interface HluAspect
{
	hlu: number; // low nibble, even values 0x0..0xE
	dir: number;  // bits 4..5: 1 = East, 2 = West, 3 = both (protocol docs, group 0x01)
}

export interface HluState extends HluAspect
{
	contact?: HluAspect;
}

export class MsgAccessoryPin6 extends Message
{
	public static readonly TYPE_OCCUPANCY = 0x01;
	public static readonly TYPE_HLU = 0x02;
	public static header = (mode: MsgMode, nid: number) => {return {group: 0x01, cmd: 0x06, mode, nid}}

	constructor(header: Header, pin: number, type: number, value?: number)
	{
		super(header);
		super.push({value: pin, length: 1});
		super.push({value: type, length: 1});
		if(header.mode === MsgMode.REQ)
			return;
		//masked, so an out-of-range value can't make writeUInt16LE throw
		super.push({value: (value ?? 0) & 0xFFFF, length: 2});
	}
	get nid(): number {return this.header.nid || 0}
	get pin(): number {return this.data[0].value as number;}
	get type(): number {return this.data[1].value as number;}
	get state(): number | undefined {return this.data.length > 2 ? this.data[2].value as number : undefined;}

	// HLU word/byte layout of the pin6 state; masking keeps hlu/dir from spilling into the flag bits
	static encodeAspect(aspect: HluAspect): number
	{
		return 0x80 | ((aspect.dir & 0x03) << 4) | (aspect.hlu & 0x0f);
	}

	static decodeAspect(byte: number): HluAspect
	{
		return {hlu: byte & 0x0f, dir: (byte >> 4) & 0x03};
	}

	static encodeHlu(state: HluState): number
	{
		return ((state.contact ? MsgAccessoryPin6.encodeAspect(state.contact) : 0x00) << 8) |
			MsgAccessoryPin6.encodeAspect(state);
	}

	static decodeHlu(value: number): HluState
	{
		const state: HluState = MsgAccessoryPin6.decodeAspect(value);
		if (value & 0x8000)
			state.contact = MsgAccessoryPin6.decodeAspect(value >> 8);
		return state;
	}

	public static fromBuffer(mode: MsgMode, buffer: Buffer)
	{
		const nid = buffer.readUInt16LE(0);
		const pin = buffer.readUInt8(2);
		const type = buffer.readUInt8(3);
		const value = buffer.length >= 6 ? buffer.readUInt16LE(4) : undefined;
		const msg = new MsgAccessoryPin6(MsgAccessoryPin6.header(mode, nid), pin, type, value);
		return msg;
	}
}
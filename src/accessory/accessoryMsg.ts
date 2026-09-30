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
		super.push({value: value ?? 0, length: 2});
	}
	get nid(): number {return this.header.nid || 0}
	get pin(): number {return this.data[0].value as number;}
	get type(): number {return this.data[1].value as number;}
	get state(): number | undefined {return this.data.length > 2 ? this.data[2].value as number : undefined;}

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
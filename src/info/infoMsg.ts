
import { Header, Message, ZcanDataArray } from "../common/communication";
import { BidiType, ModInfoType, MsgMode } from "../common/enums";



export class MsgModInfo extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x08, cmd: 0x08, mode: mode, nid}}
	
	constructor(header: Header, type: ModInfoType, data: ZcanDataArray = [])
	{
		super(header);
		super.push({value: type, length: 2});
		if(data.length)
			this.data = this.data.concat(data);
	}
	type(): ModInfoType | undefined {return ((this.data[0].value as unknown) as ModInfoType)}
	info(): number | undefined {return this.data.length > 1 ? this.data[1].value as number : undefined}
}

export class MsgBidiInfo extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x08, cmd: 0x05, mode: mode, nid}}
	
	constructor(header: Header, type: number, nid?: number, info?: number)
	{
		super(header);
		
		if(header.mode === MsgMode.REQ) {
			super.push({value: nid || 0, length: 2});
			super.push({value: type, length: 2});
		} else {
			super.push({value: type, length: 2});
			super.push({value: info || 0, length: 4});
		}
	}
	public get nid() {return this.header.mode === MsgMode.REQ ? this.data[0].value as number : this.header.nid || 0}
	public get type() {return this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value as BidiType}
	public get info() {return this.data.length > 1 ? this.data[1].value as number : undefined}

	public static fromBuffer(mode: number, buf: Buffer): MsgBidiDir | MsgBidiSpeed  | MsgBidiInfo
	{
		const NID = buf.readUInt16LE(0);
		const type = buf.readUInt16LE(2);
		const info = buf.readUInt32LE(4);
		switch(type)
		{
			case BidiType.DIRECTION:
				return MsgBidiDir.fromBuffer(mode, buf);
			case BidiType.SPEED_REPORT:
				return MsgBidiSpeed.fromBuffer(mode, buf);
			default:
				return new MsgBidiInfo(MsgBidiInfo.header(mode, NID), type, undefined, info);
		}
	}
}

export class MsgBidiSpeed extends MsgBidiInfo
{
	constructor(header: Header, nid?: number, info?: number)
	{
		super(header, BidiType.SPEED_REPORT, nid, info);
	}
	get speed() {return this.info}

	static fromBuffer(mode: number, buf: Buffer)
	{
		const NID = buf.readUInt16LE(0);
		const type = buf.readUInt16LE(2);
		const info = buf.readUInt32LE(4);
		return new MsgBidiSpeed(MsgBidiInfo.header(mode, NID), undefined, info);
	}
}

export class MsgBidiDir extends MsgBidiInfo
{
	constructor(header: Header, nid?: number, info?: number)
	{
		super(header, BidiType.DIRECTION, nid, info);
	}
	get fwd() {return super.info === undefined ? undefined : !!(super.info & 0x01)}
	get east() {return this.info === undefined ? undefined : !!(this.info & 0x02)}
	get change() {return this.info === undefined ? undefined : !!(this.info & 0x04)}
	get confirm() {return this.info === undefined ? undefined : !!(this.info & 0x08)}

	static fromBuffer(mode: number, buf: Buffer)
	{
		const nid = buf.readUInt16LE(0);
		const type = buf.readUInt16LE(2);
		const info = buf.readUInt32LE(4);
		return new MsgBidiDir(MsgBidiInfo.header(mode, nid), undefined, info);
	}
}
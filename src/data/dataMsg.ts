
import ExtendedASCII from "../common/extendedAscii";
import { Header, Message } from "../common/communication";
import { MsgMode, NameType } from "../common/enums";


export class MsgGroupCount extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x0, mode: mode, nid: nid}}

	constructor(header: Header, group?: number, count?: number)
	{
		super(header);
		if(group !== undefined)
			super.push({value: group, length: 2});
		// super.push({value: groupNid, length: 2});
		if(count !== undefined)
			super.push({value: count, length: 2});
	}

	group() {return this.data.length ? this.data[0].value as number : this.header.nid;}
	count() {return this.data.length > 1 ? this.data[1].value as number : 0;}
}


export class MsgItemsByIndexReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

	constructor(header: Header, mx10Nid: number, groupNid: number, index: number)
	{
		super(header);
		// super.push({value: mx10Nid, length: 2});
		super.push({value: groupNid, length: 2});
		super.push({value: index, length: 2});
	}
}

export class MsgItemsByIndexRsp extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

	constructor(header: Header, index: number, itemNid: number, lastTick: number)
	{
		super(header);
		super.push({value: index, length: 2});
		super.push({value: itemNid, length: 2});
		if(lastTick !== undefined)
			super.push({value: lastTick, length: 2});
	}
	index(): number {return (this.data[0].value as number)}
	itemNid(): number {return (this.data[1].value as number)}
	lastTick(): number {return (this.data[2].value as number)}
	// lastTick(): number {return this.data.length > 4 ? (this.data[4].value as number) : 0}
}

export class MsgItemsByNidReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x2, mode: mode, nid: nid}}

	constructor(header: Header, mx10Nid: number, precedingNid: number)
	{
		super(header);
		super.push({value: mx10Nid, length: 2});
		super.push({value: precedingNid, length: 2});
	}
}

export class MsgItemsByNidRsp extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x2, mode: mode, nid: nid}}

	constructor(header: Header, itemNid: number, index: number, itemState: number, lastTick: number | undefined)
	{
		super(header);
		super.push({value: itemNid, length: 2});
		super.push({value: index, length: 2});
		super.push({value: itemState, length: 2});
		if(lastTick !== undefined)
			super.push({value: lastTick, length: 2});
	}
	itemNid(): number {return (this.data[1].value as number)}
	index(): number {return (this.data[2].value as number)}
	itemState(): number {return (this.data[3].value as number)}
	lastTick(): number {return (this.data[4].value as number)}
}

export class MsgDataName extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x21, mode: mode, nid: nid}}

	constructor(header: Header, subId: number, name?: string, v1?: number, v2?: number)
	{
		super(header);
		super.push({value: subId, length: 2});
		super.push({value: v1 || 0, length: 4});
		super.push({value: v2 || 0, length: 4});
		if(header.mode === MsgMode.REQ || name === undefined)
			return;
		super.push({value: name, length: Math.min(name.length, 32)});
		super.push({value: 0, length: 1});
	}
	itemNid(): number {return this.header.nid || 0;}
	subId(): number {return (this.data[0].value as number)}
	value1(): number {return (this.data[1].value as number)}
	value2(): number {return (this.data[2].value as number)}
	name(): string | undefined {return this.data.length < 4 ? undefined : (this.data[3].value as string)}
	type(): NameType
	{
		switch (this.itemNid())
		{
			case 0x7f00:
				return NameType.MANUFACTURER;
			case 0x7f02:
				return NameType.DECODER;
				break;
			case 0x7f04:
				return NameType.DESIGNATION;
				// value1 = {type: buffer.subarray(4).toString('ascii').trim(),
				// 	cfgNum: parseInt(buffer.subarray(5, 7).toString('ascii'))};
			case 0x7f06:
				return NameType.CFGDB;
				break;
			case 0x7f10:
				return NameType.ICON;
				break;
			case 0x7f11:
				return NameType.ICON;
				break;
			case 0x7f18:
				return NameType.ZIMO_PARTNER;
				break;
			case 0x7f20:
				return NameType.LAND;
				break;
			case 0x7f21:
				return NameType.COMPANY_CV;
				break;
			case 0xc2:
				return NameType.CONNECTION;
				break;
			default:
				if(this.subId() == 1)
					return NameType.COMPANY_CV;
				if(this.subId() == 0)
					return NameType.VEHICLE;
				return NameType.CONNECTION;
		}
	}

	public static fromBuffer(mode: MsgMode, mx10Nid: number, buffer: Buffer)
	{
		const nid = buffer.readUInt16LE(0);
		const subId = buffer.readUInt16LE(2);
		const v1 = buffer.readUint32LE(4);
		const v2 = buffer.readUint32LE(8);
		const name = ExtendedASCII.byte2str(buffer.subarray(12, 203));
		const msg = new MsgDataName(MsgDataName.header(mode, nid), subId, name, v1, v2);
		return msg;
	}
}

export class MsgItemImage extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x12, mode: mode, nid: nid}}

	constructor(header: Header, itemNid: number, imageType: number, imageId?: number)
	{
		super(header);
		super.push({value: itemNid, length: 2});
		super.push({value: imageType, length: 2});
		if(header.mode === MsgMode.REQ || imageId === undefined)
			return;
		super.push({value: imageId, length: 2});
	}
	itemNid(): number {return (this.header.mode === MsgMode.REQ ? this.data[0].value as number : this.header.nid || 0)}
	imageType(): number {return (this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value as number)}
	imageId(): number {return (this.header.mode === MsgMode.REQ ? 0 : this.data[1].value as number)}
}
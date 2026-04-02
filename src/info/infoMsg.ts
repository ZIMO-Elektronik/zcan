
import { Header, Message, ZcanDataArray } from "../common/communication";
import { ModInfoType, MsgMode } from "../common/enums";



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
	nid(): number {return this.header.mode === MsgMode.REQ ? this.data[0].value as number : this.header.nid || 0}
	type(): number {return this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value as number}
	info(): number | undefined {return this.data.length > 1 ? this.data[1].value as number : undefined}

	public static dirEast(info: number)
	{
		return ((info & 0x02) == 0x02)
	}

	public static dirChanging(info: number)
	{
		return ((info & 0x04) == 0x04)
	}

	public static dirForward(info: number)
	{
		return ((info & 0x01) == 0x01)
	}

	public static dirConfirm(info: number)
	{
		return ((info & 0x08) == 0x08)
	}
}
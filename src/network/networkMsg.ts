import { Header, Message } from "../common/communication";
import { MsgMode } from "../common/enums";


export class MsgPortOpen extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x1a, cmd: 0x6, mode: mode, nid: nid}}

	constructor(header: Header, clientId: number, comFlags: number = 0xffffffff, clientName?: string)
	{
		super(header);
		super.push({value: comFlags, length: 4});
		super.push({value: clientId, length: 4});
		if(clientName)
			super.push({value: clientName, length: 20});
	}

	comFlags() {return this.data.length ? this.data[0].value as number : undefined;}
	clientId() {return this.data.length > 1 ? this.data[1].value as number : 0;}
	clientName() {return this.data.length > 2 ? this.data[2].value as string : 0;}
}

export class MsgPortClose extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0xa, cmd: 0x7, mode: mode, nid: nid}}

	constructor(header: Header, myNid: number)
	{
		super(header);
		super.push({value: myNid, length: 2});
	}
}
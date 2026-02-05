
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
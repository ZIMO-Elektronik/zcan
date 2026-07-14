import { AccessoryMode, MsgMode } from "../common/enums";
import { Header, Message } from "../common/communication";


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
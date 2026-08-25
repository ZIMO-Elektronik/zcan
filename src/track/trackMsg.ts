
import { Header, Message } from "../common/communication";
import { MsgMode } from "../common/enums";


export class MsgCvRead extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x16, cmd: 0x08, mode: mode, nid: nid}}

	constructor(header: Header, trainNid: number, cvNum: number, cvVal: number | undefined = undefined)
	{
		super(header);
		super.push({value: trainNid, length: 2});
		super.push({value: cvNum, length: 4});
		if(cvVal !== undefined)
			super.push({value: cvVal, length: 2});
	}
	trainNid(): number {return (this.data[0].value as number)}
	cvNum(): number {return (this.data[1].value as number)}
	cvVal(): number | undefined {return this.data.length > 2 ? this.data[2].value as number : undefined}
}

export class MsgCvWrite extends MsgCvRead
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x16, cmd: 0x09, mode: mode, nid: nid}}

	constructor(header: Header, trainNid: number, cvNum: number, cvVal: number)
	{
		super(header, trainNid, cvNum, cvVal);
		this.data[2].length = 1;
	}
}

export class MsgCvWrite16 extends MsgCvRead
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x16, cmd: 0x0d, mode: mode, nid: nid}}

	constructor(header: Header, trainNid: number, cvNum: number, cvVal: number)
	{
		super(header, trainNid, cvNum, cvVal);
		this.data[1].length = 2;
	}
}

export class MsgCvWriteBit extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x16, cmd: 0x06, mode: mode, nid: nid}}

	constructor(header: Header, trainNid: number, cvNum: number, bitNum: number, bitVal: number)
	{
		super(header);
		super.push({value: trainNid, length: 2});
		super.push({value: cvNum, length: 4});
		super.push({value: bitNum, length: 1});
		super.push({value: bitVal, length: 1});
	}
	get nid(): number {return (this.data[0].value as number)}
	get cvNum(): number {return (this.data[1].value as number)}
	get bitNum(): number | undefined {return this.data[2].value as number}
	get bitVal(): number | undefined {return this.data[3].value as number}
}
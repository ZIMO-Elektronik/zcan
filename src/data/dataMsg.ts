
import { Train, TrainFunction } from '../common/models';
import { Header, Message, MessagePart, ZcanData } from "../common/communication";
import { FunctionMode, MsgMode, OperatingMode } from "../common/enums";
import ExtendedASCII from '../common/extendedAscii';


export class MsgItemsByIndexReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

	constructor(header: Header, mx10Nid: number, groupNid: number, index: number)
	{
		super(header);
		super.push({value: mx10Nid, length: 2});
		super.push({value: groupNid, length: 2});
		super.push({value: index, length: 2});
	}
}

export class MsgItemsByIndexRsp extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

	constructor(header: Header, index: number, itemNid: number, itemState: number, lastTick: number | undefined)
	{
		super(header);
		super.push({value: index, length: 2});
		super.push({value: itemNid, length: 2});
		super.push({value: itemState, length: 2});
		if(lastTick !== undefined)
			super.push({value: lastTick, length: 2});
	}
	index(): number {return (this.data[1].value as number)}
	itemNid(): number {return (this.data[2].value as number)}
	itemState(): number {return (this.data[3].value as number)}
	lastTick(): number {return (this.data[4].value as number)}
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

export class MsgLocoGuiReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x27, mode: mode, nid: nid}}

	constructor(header: Header, locoNid: number, subId: number)
	{
		super(header);
		super.push({value: locoNid, length: 2});
		super.push({value: subId, length: 2});
	}
	locoNid(): number {return (this.data[0].value as number)}
	subId(): number {return (this.data[1].value as number)}
}

export class MsgLocoGui extends Message
{
	public static header(mode: MsgMode, locoNid: number): Header
	{return {group: 0x17, cmd: 0x27, mode: mode, nid: locoNid}}

	constructor(header: Header, subId: number, data: ZcanData[] = [])
	{
		super(header);
		super.push({value: subId, length: 2});
		if(data.length)
			this.data = this.data.concat(data);
	}
	locoNid(): number {return this.header.nid}
	subId(): number {return (this.data[0].value as number)}
	// version(): number {return (this.data[1].value as number)}
	// flags(): number {return (this.data[2].value as number)}
	group(): number {return (this.data[1].value as number)}
	name(): string {return (this.data[2].value as string)}
	imgId(): number {return (this.data[3].value as number)}
	imgCrc(): number {return (this.data[4].value as number)}
	tachoId(): number {return (this.data[5].value as number)}
	tachoCrc(): number {return (this.data[6].value as number)}
	vMaxFwd(): number {return (this.data[7].value as number)}
	vMaxRev(): number {return (this.data[8].value as number)}
	vRank(): number {return (this.data[9].value as number)}
	engine(): number {return (this.data[10].value as number)}
	epoch(): number {return (this.data[11].value as number)}
	country(): number {return (this.data[12].value as number)}
	fxIcons(): number[]
	{
		if(this.data.length < 13+32)
			return [];
		return (this.data.slice(13, 13+32).map(data => {return data.value as number;}));
	}
	fxModes(): number[]
	{
		if(this.data.length < 46+32)
			return [];
		return (this.data.slice(46, 46+32).map(data => {return data.value as number;}));
	}
	toTrain(): Train
	{
		const functions = Array<TrainFunction>();
		const icons = this.fxIcons();
		const modes = this.fxModes();
		for(let i=0; i<icons.length; i++)
		{
			const iconString = icons[i] === 0 ? String(i).padStart(2, '0') : String(icons[i]);
			functions.push({
				mode: FunctionMode.switch,
				active: false,
				icon: iconString.padStart(4, icons[i] === 0 ? '07' : '0'),
			});
		}
		return({
			nid: this.header.nid,
			subId: this.subId(),
			name: this.name(),
			group: this.group(),
			image: this.imgId() == 0 ? undefined : this.imgId().toString(),
			tacho: this.tachoId().toString(),
			vMaxFwd: this.vMaxFwd(),
			vMaxRev: this.vMaxRev(),
			vRank: this.vRank(),
			operatingMode: OperatingMode.UNKNOWN,
			engine: this.engine(),
			epoch: MsgLocoGui.epoch2Str(this.epoch()),
			country: this.country(),
			functions: functions,
		});
	}
	public static fromTrain(mode: MsgMode, train: Train): MsgLocoGui
	{
		const msg = new MsgLocoGui(MsgLocoGui.header(mode, train.nid), 0);
		// msg.push({value: 0, length: 4});
		// msg.push({value: 0, length: 2});
		msg.push({value: train.group, length: 2});
		msg.push({value: train.name, length: 32});
		msg.push({value: Number(train.image), length: 2});
		msg.push({value: 0, length: 4});
		msg.push({value: Number(train.tacho), length: 2});
		msg.push({value: 0, length: 4});
		msg.push({value: train.vMaxFwd, length: 2});
		msg.push({value: train.vMaxRev, length: 2});
		msg.push({value: train.vRank, length: 2});
		msg.push({value: train.engine, length: 2});
		msg.push({value: MsgLocoGui.str2Epoch(train.epoch), length: 2});
		msg.push({value: train.country, length: 2});
		train.functions.map(fun => Number(fun.icon)).forEach(icon => {
			msg.push({value: icon, length: 2});
		});
		train.functions.map(fun => Number(fun.mode)).forEach(mode => {
			msg.push({value: mode, length: 2});
		});
		return msg;
	}
	public static fromBuffer(mode: MsgMode, buffer: Buffer): MsgLocoGui
	{
		const locoNid = buffer.readUInt16LE(0);
		const subId = buffer.readUInt16LE(2);
		const msg = new MsgLocoGui(MsgLocoGui.header(mode, locoNid), subId);
		msg.push({value: buffer.readUInt16LE(4), length: 2});
		msg.push({value: ExtendedASCII.byte2str(buffer.subarray(6, 32)), length: 32});
		msg.push({value: buffer.readUInt16LE(38), length: 2});
		msg.push({value: buffer.readUInt16LE(40), length: 4});
		msg.push({value: buffer.readUInt16LE(44), length: 2});
		msg.push({value: buffer.readUInt16LE(46), length: 4});
		msg.push({value: buffer.readUInt16LE(50), length: 2});
		msg.push({value: buffer.readUInt16LE(52), length: 2});
		msg.push({value: buffer.readUInt16LE(54), length: 2});
		msg.push({value: buffer.readUInt16LE(56), length: 2});
		msg.push({value: buffer.readUInt16LE(58), length: 2});
		msg.push({value: buffer.readUInt16LE(60), length: 2});
		if(buffer.length >= 118+64) for (let i=118; i<118+64; i+=2)
			msg.push({value: buffer.readUInt16LE(i), length: 2});
		if(buffer.length >= 182+64) for (let i=182; i<182+64; i+=2)
			msg.push({value: buffer.readUInt16LE(i), length: 2});
		return msg;
	}
	public static epoch2Str(epoch: number): string
	{
		switch (epoch & 0xf0) {
			case 0x10:
				return 'I';
			case 0x20:
				return 'II';
			case 0x30:
				return 'III';
			case 0x40:
				return 'IV';
			case 0x50:
				return 'V';
			case 0x60:
				return 'VI';
			case 0x70:
				return 'VII';
			default:
				return '';
		}
	}
	public static str2Epoch(epoch: string): number
	{
		switch (epoch) {
			case 'I':
				return 0x10;
			case 'II':
				return 0x20;
			case 'III':
				return 0x30;
			case 'IV':
				return 0x40;
			case 'V':
				return 0x50;
			case 'VI':
				return 0x60;
			case 'VII':
				return 0x70;
			default:
				return 0;
		}
	}
}

export class MsgLocoGuiMxReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x28, mode: mode, nid: nid}}

	constructor(header: Header, locoNid: number, subId: number)
	{
		super(header);
		super.push({value: locoNid, length: 2});
		super.push({value: subId, length: 2});
	}
	locoNid(): number {return (this.data[0].value as number)}
	subId(): number {return (this.data[1].value as number)}
}

export class MsgLocoGuiMx extends Message
{
	public static header(mode: MsgMode, locoNid: number): Header
	{return {group: 0x17, cmd: 0x28, mode: mode, nid: locoNid}}

	static readonly parts: MessagePart[] = [
		{index: -1, offset: 0, length: 2},
		{index: 0, offset: 2, length: 2},
		{index: 1, offset: 4, length: 4},
		{index: 2, offset: 8, length: 2},
		{index: 3, offset: 10, length: 2},
		{index: 4, offset: 12, length: 32},
		{index: 5, offset: 44, length: 2},
		{index: 6, offset: 46, length: 2},
		{index: 7, offset: 48, length: 2},
		{index: 8, offset: 50, length: 2},
		{index: 9, offset: 52, length: 2},
		{index: 10, offset: 54, length: 2},
		{index: 11, offset: 56, length: 2},
		{index: 12, offset: 58, length: 2},
		{index: 13, offset: 60, length: 8},
		{index: 14, offset: 68, length: 64, slice: 2},
		{index: 15, offset: 132, length: 64, slice: 2},
	];

	constructor(header: Header, subId: number, data: ZcanData[] = [])
	{
		super(header, MsgLocoGuiMx.parts);
		super.push({value: subId, length: 2});
		if(data.length)
			this.data = this.data.concat(data);
	}
	
	locoNid():	number {return this.get(MsgLocoGuiMx.parts[0], 0) as number;}
	subId():	number {return this.get(MsgLocoGuiMx.parts[1], 0) as number;}
	version():	number {return this.get(MsgLocoGuiMx.parts[2], 0) as number;}
	flags():	number {return this.get(MsgLocoGuiMx.parts[3], 0) as number;}
	group():	number {return this.get(MsgLocoGuiMx.parts[4], 0) as number;}
	name():		string {return this.get(MsgLocoGuiMx.parts[5], '') as string;}
	imgId():	number {return super.get(MsgLocoGuiMx.parts[6]) as number;}

	tachoId():	number {return this.get(MsgLocoGuiMx.parts[7], 0) as number;}
	vMaxFwd():	number {return this.get(MsgLocoGuiMx.parts[8], 0) as number;}
	vMaxRev():	number {return this.get(MsgLocoGuiMx.parts[9], 0) as number;}
	vRank():	number {return this.get(MsgLocoGuiMx.parts[10], 0) as number;}
	engine():	number {return this.get(MsgLocoGuiMx.parts[11], 0) as number;}
	epoch():	number {return this.get(MsgLocoGuiMx.parts[12], 0) as number;}
	country():	number {return this.get(MsgLocoGuiMx.parts[13], 0) as number;}
	fxIcons():	number[]
	{
		const rv = this.get(MsgLocoGuiMx.parts[15], []) as ZcanData[];
		return rv.map(v => v.value as number);
	}
	fxModes():	number[]
	{
		const rv = this.get(MsgLocoGuiMx.parts[16], []) as ZcanData[];
		return rv.map(v => v.value as number);
	}
	// fxIcons():	number[]
	// {
	// 	if(this.data.length < 17+32)
	// 		return [];
	// 	return (this.data.slice(17, 17+32).map(data => {return data.value as number;}));
	// }
	// fxModes(): number[]
	// {
	// 	if(this.data.length < 49+32)
	// 		return [];
	// 	return (this.data.slice(49, 49+32).map(data => {return data.value as number;}));
	// }
	toTrain(): Train
	{
		const functions = Array<TrainFunction>();
		const icons = this.fxIcons();
		const modes = this.fxModes();
		for(let i=0; i<icons.length; i++)
		{
			const iconString = icons[i] === 0 ? String(i).padStart(2, '0') : String(icons[i]);
			functions.push({
				mode: FunctionMode.switch,
				active: false,
				icon: iconString.padStart(4, icons[i] === 0 ? '07' : '0'),
			});
		}
		return({
			nid: this.header.nid,
			subId: this.subId(),
			name: this.name(),
			group: this.group(),
			image: this.imgId() == 0 ? undefined : this.imgId().toString(),
			tacho: this.tachoId().toString(),
			vMaxFwd: this.vMaxFwd(),
			vMaxRev: this.vMaxRev(),
			vRank: this.vRank(),
			operatingMode: OperatingMode.UNKNOWN,
			engine: this.engine(),
			epoch: MsgLocoGuiMx.epoch2Str(this.epoch()),
			country: this.country(),
			functions: functions,
		});
	}
	public static fromTrain(mode: MsgMode, train: Train): MsgLocoGuiMx
	{
		const msg = new MsgLocoGuiMx(MsgLocoGuiMx.header(mode, train.nid), 0x100);
		
		msg.push({value: 0x01000000, length: 4});
		msg.push({value: 0, length: 2});
		msg.push({value: train.group, length: 2});
		msg.push({value: train.name, length: 32});
		msg.push({value: Number(train.image), length: 2});
		msg.push({value: Number(train.tacho), length: 2});
		msg.push({value: train.vMaxFwd, length: 2});
		msg.push({value: train.vMaxRev, length: 2});
		msg.push({value: train.vRank, length: 2});
		msg.push({value: train.engine, length: 2});
		msg.push({value: MsgLocoGuiMx.str2Epoch(train.epoch), length: 2});
		msg.push({value: train.country, length: 2});
		msg.push({value: 0, length: 8});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		train.functions.map(fun => Number(fun.icon)).forEach(icon => {
			msg.push({value: icon, length: 2});
		});
		train.functions.map(fun => Number(fun.mode)).forEach(mode => {
			msg.push({value: mode, length: 2});
		});
		return msg;
	}
	public static fromBuffer(mode: MsgMode, buffer: Buffer): MsgLocoGuiMx
	{
		const locoNid = buffer.readUInt16LE(0);
		const subId = buffer.readUInt16LE(2);
		const msg = new MsgLocoGuiMx(MsgLocoGuiMx.header(mode, locoNid), subId);
		msg.fill(buffer, 2);

		// msg.push({value: buffer.readUInt32LE(4), length: 4});
		// msg.push({value: buffer.readUInt16LE(8), length: 2});
		// msg.push({value: buffer.readUInt16LE(10), length: 2});
		// msg.push({value: ExtendedASCII.byte2str(buffer.subarray(12, 43)), length: 32});
		// msg.push({value: buffer.readUInt16LE(44), length: 2});
		// msg.push({value: buffer.readUInt16LE(46), length: 2});
		// msg.push({value: buffer.readUInt16LE(48), length: 2});
		// msg.push({value: buffer.readUInt16LE(50), length: 2});
		// msg.push({value: buffer.readUInt16LE(52), length: 2});
		// msg.push({value: buffer.readUInt16LE(54), length: 2});
		// msg.push({value: buffer.readUInt16LE(56), length: 2});
		// msg.push({value: buffer.readUInt16LE(58), length: 2});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		// msg.push({value: 0, length: 2});
		// if(buffer.length >= 68+64) for (let i=68; i<68+64; i+=2)
		// 	msg.push({value: buffer.readUInt16LE(i), length: 2});
		// if(buffer.length >= 132+64) for (let i=132; i<132+64; i+=2)
		// 	msg.push({value: buffer.readUInt16LE(i), length: 2});
		return msg;
	}
	public static epoch2Str(epoch: number): string
	{
		switch (epoch & 0xf0) {
			case 0x10:
				return 'I';
			case 0x20:
				return 'II';
			case 0x30:
				return 'III';
			case 0x40:
				return 'IV';
			case 0x50:
				return 'V';
			case 0x60:
				return 'VI';
			case 0x70:
				return 'VII';
			default:
				return '';
		}
	}
	public static str2Epoch(epoch: string): number
	{
		switch (epoch) {
			case 'I':
				return 0x10;
			case 'II':
				return 0x20;
			case 'III':
				return 0x30;
			case 'IV':
				return 0x40;
			case 'V':
				return 0x50;
			case 'VI':
				return 0x60;
			case 'VII':
				return 0x70;
			default:
				return 0;
		}
	}
}
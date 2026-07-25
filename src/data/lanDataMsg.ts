import { FunctionMode, StepMax, MsgMode, OpMode } from "../common/enums";
import { Header, Message, ZcanData } from "../common/communication";
import { TrainFunction } from "../docs_entrypoint";


export class MsgLocoGuiReq extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x28, mode: mode, nid: nid}}

	constructor(header: Header, locoNid: number, subNid: number)
	{
		super(header);
		super.push({value: locoNid, length: 2});
		super.push({value: subNid, length: 2});
	}
	locoNid(): number {return (this.data[0].value as number)}
	subNid(): number {return (this.data[1].value as number)}
}

export class MsgLocoGuiRsp extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x28, mode: mode, nid: nid}}

	constructor(header: Header, locoNid: number, subNid: number, version: number, flags: number, group: number,
		name: string, imageId: number, imageCrc: number,  tachoId: number, tachoCrc: number,
		speedFwd: number, speedRev: number, speedRnk: number, driveType: number, era: number,
		country: number, funImgs: number[], funModes: number[])
	{
		super(header);
		super.push({value: locoNid, length: 2});
		super.push({value: subNid, length: 2});
		super.push({value: version, length: 4});
		super.push({value: flags, length: 2});
		super.push({value: group, length: 2});
		super.push({value: name, length: 32});
		super.push({value: imageId, length: 2});
		super.push({value: imageCrc, length: 4});
		super.push({value: tachoId, length: 2});
		super.push({value: tachoCrc, length: 4});
		super.push({value: speedFwd, length: 2});
		super.push({value: speedRev, length: 2});
		super.push({value: speedRnk, length: 2});
		super.push({value: driveType, length: 2});
		super.push({value: era, length: 2});
		super.push({value: country, length: 2});
		funImgs.forEach(funk => {
			super.push({value: funk, length: 2});
		});
		funModes.forEach(funk => {
			super.push({value: funk, length: 2});
		});
	}
	locoNid(): number {return (this.data[0].value as number)}
	subNid(): number {return (this.data[1].value as number)}
	group(): number {return (this.data[4].value as number)}
	name(): string {return (this.data[5].value as string)}
	imageId(): number {return (this.data[6].value as number)}
	tacho(): number {return (this.data[8].value as number)}
	speedFwd(): number {return (this.data[10].value as number)}
	speedRev(): number {return (this.data[11].value as number)}
	speedRnk(): number {return (this.data[12].value as number)}
	driveType(): number {return (this.data[13].value as number)}
	era(): number {return (this.data[14].value as number)}
	country(): number {return (this.data[15].value as number)}
	functions(): Array<TrainFunction>
	{
		const rv = Array<TrainFunction>();
		for (let i = 16; i < 80; i++) {
			const icon = (this.data[i].value as number);
			const iconString = icon === 0 ? String(i).padStart(2, '0') : String(icon);
			rv.push({mode: FunctionMode.switch, active: false,
				icon: iconString.padStart(4, icon === 0 ? '07' : '0'),
			});
		}
		for (let i = 80; i < 144; i++) {
			rv[i-80].mode = this.data[i].value as number;
		}
		return rv;
	}

	public static parseEra(era: number)
	{
		switch (era & 0xf0)
		{
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
}

export class MsgDataValueX extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x08, mode: mode, nid: nid}}

	constructor(header: Header, nid: number, subId: number, data?: ZcanData[])
	{
		super(header);
		super.push({value: nid, length: 2});
		super.push({value: subId, length: 2});
		if(data)
			super.push(...data);
	}
	get nid(): number {return (this.data[0].value as number)}
	get subId(): number {return (this.data[1].value as number)}
	get decoder() {return {vendor: this.data[2].value as number, uid: this.data[3].value as number,
		type: this.data[4].value as number, sound: this.data[5].value as number}}
	get stepMax() {return (this.data[6].value as number & 0xf) as StepMax}
	get opMode() {return (this.data[6].value as number >> 4) as OpMode}
	get funCount() {return this.data[7].value as number}
	get txCount() {return this.data[8].value as number}
	get rxCount() {return this.data[9].value as number}
	get something() {return this.data[10].value as number}
	get owner() {return {nid: this.data[11].value as number, tick: this.data[12].value as number}}
	get groupie() {return {nid: this.data[13].value as number, tick: this.data[14].value as number}}
	get dirBits() {return {reverseCmd: !!((this.data[15].value as number)&0x400),
		reverseAck: !!((this.data[15].value as number)&0x800), stop: !!((this.data[15].value as number)&0x8000)}}
	get speedStep() {return (this.data[15].value as number) & 0x3ff}
	get digtalFun() {
		// Message.log('MsgDataValueX -> digFun' + (this.data[16].value as number).toString(2) + ' = ' +
		// 	(this.data[16].value as number).toString(2).padStart(32, '0').split('') + ' = ' +
		// 	(this.data[16].value as number).toString(2).padStart(32, '0').split('').map(bit => bit === '1'));
		return (this.data[16].value as number).toString(2).padStart(32, '0').split('').reverse().map(bit => bit === '1')}
	get specialFun() {return {
		shunt: parseInt((this.data[17].value as number).toString(2).padStart(32, '0').split('').reverse().slice(0, 4).join(''), 2),
		man: parseInt((this.data[17].value as number).toString(2).padStart(32, '0').split('').reverse().slice(4, 6).join(''), 2)}}
	get analogFun()
		{return this.data.slice(18, 64).map(fun => fun.value as number).map(fun => {return {id: fun&0xff, state: fun>>8}})}

	static fromBuffer(mode: MsgMode, nid: number, buffy: Buffer)
	{
		const locoNid = buffy.readUInt16LE(0);
		const subId = buffy.readUInt16LE(2);
		let offset = 4;
		const data: ZcanData[] = [];
		const slices = [2, 4, 2, 4, 1, 1, 2, 2, 2, 2, 4, 2, 4, 2, 4, 4];
		for(let i=0; i<32; i++)
			slices.push(2);
		for(let length of slices) {
			let value = 0;
			switch(length) {
				case 1:
					value = buffy.readUInt8(offset);
					break;
				case 2:
					value = buffy.readUInt16LE(offset);
					break;
				case 4:
					value = buffy.readUInt32LE(offset);
					break;
			}
			data.push({value, length});
			offset += length;
		}
		return new MsgDataValueX(MsgDataValueX.header(mode, nid), locoNid, subId, data);
	}
}
import { FxMode, StepMax, MsgMode, OpMode } from "../common/enums";
import { Header, Message, ZcanData } from "../common/communication";
import {Buffer} from 'buffer';
import {DriveType, Era, LocoFx, LocoGui} from '../common/models';
import ExtendedASCII from "../common/extendedAscii";


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
	get nid(): number {return (this.data[0].value as number)}
	get subNid(): number {return (this.data[1].value as number)}
}

export class MsgLocoGuiRsp extends Message implements LocoGui
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x28, mode: mode, nid: nid}}

	constructor(header: Header, locoNid: number, subId: number, version: number, flags: number, group: number,
		name: string, imageId: number, imageCrc: number,  tachoId: number, tachoCrc: number,
		maxSpeedFwd: number, maxSpeedRev: number, shuntingSpeed: number, driveType: DriveType, era: Era,
		country: number, funImgs: number[], fxModes: number[])
	{
		super(header);
		super.push({value: locoNid, length: 2});
		super.push({value: subId, length: 2});
		super.push({value: version, length: 4});
		super.push({value: flags, length: 2});
		super.push({value: group, length: 2});
		super.push({value: name, length: 32});
		super.push({value: imageId, length: 2});
		super.push({value: imageCrc, length: 4});
		super.push({value: tachoId, length: 2});
		super.push({value: tachoCrc, length: 4});
		super.push({value: maxSpeedFwd, length: 2});
		super.push({value: maxSpeedRev, length: 2});
		super.push({value: shuntingSpeed, length: 2});
		super.push({value: driveType, length: 2});
		super.push({value: era, length: 2});
		super.push({value: country, length: 2});
		funImgs.forEach(img => super.push({value: img, length: 2}));
		fxModes.forEach(mode => super.push({value: mode, length: 2}));
	}
	get nid(): number {return (this.data[0].value as number)}
	get subId(): number {return (this.data[1].value as number)}
	get group(): number {return (this.data[4].value as number)}
	get name(): string {return (this.data[5].value as string)}
	get image(): number {return (this.data[6].value as number)}
	get tacho(): number {return (this.data[8].value as number)}
	get maxSpeedFwd(): number {return (this.data[10].value as number)}
	get maxSpeedRev(): number {return (this.data[11].value as number)}
	get shuntingSpeed(): number {return (this.data[12].value as number)}
	get driveType(): number {return (this.data[13].value as number)}
	get era(): number {return (this.data[14].value as number)}
	get country(): number {return (this.data[15].value as number)}
	get fx(): Array<LocoFx>
	{
		const rv = Array<LocoFx>();
		for(let i=16; i<80; i++) {
			const icon = (this.data[i].value as number);
			rv.push({icon, mode: FxMode.TOGGLE, active: false, time: 0});
		}
		for(let i=80; i<144; i++) {
			rv[i-80].mode = (this.data[i].value as number) >> 14;
			rv[i-80].time = (this.data[i].value as number) & 0x3fff;
		}
		return rv;
	}

	public static fromBuffer(mode: MsgMode, nid: number, buffer: Buffer)
	{
		const NID = buffer.readUInt16LE(0);
		const SubID = buffer.readUInt16LE(2);
		const version = buffer.readUInt32LE(4);
		const flags = buffer.readUInt16LE(8);
		const group = buffer.readUInt16LE(10);
		const name = ExtendedASCII.byte2str(buffer.subarray(12, 32));
		const imageId = buffer.readUInt16LE(44);
		const imageCrc = buffer.readUInt32LE(46);
		const tachoId = buffer.readUInt16LE(50);
		const tachoCrc = buffer.readUInt32LE(52);
		const maxSpeedFwd = buffer.readUInt16LE(56);
		const maxSpeedRev = buffer.readUInt16LE(58);
		const shuntingSpeed = buffer.readUInt16LE(60);
		const driveType = buffer.readUInt16LE(62);
		const era = buffer.readUInt16LE(64);
		const country = buffer.readUInt16LE(66);
		const funImg: number[] = [];
		for(let i=0; i<64; i++) {
			const img = buffer.readUInt16LE(68 + 2*i);
			funImg.push(img);
		}
		const funMode: number[] = [];
		for(let i=0; i<64; i++) {
			const fmode = buffer.readUInt16LE(196 + 2*i);
			funMode.push(fmode);
		}

		return new MsgLocoGuiRsp(MsgLocoGuiRsp.header(mode, nid), NID, SubID, version, flags, group, name,
			imageId, imageCrc, tachoId, tachoCrc, maxSpeedFwd, maxSpeedRev, shuntingSpeed, driveType, era, country,
			funImg, funMode);
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

export class MsgItemListByIdxX extends Message
{
	public static header(mode: MsgMode, nid: number): Header
	{return {group: 0x17, cmd: 0x01, mode: mode, nid: nid}}

	constructor(header: Header, idx: number, data?: ZcanData[], group?: number)
	{
		super(header);
		if(group !== undefined)
			super.push({value: group, length: 2});
		super.push({value: idx, length: 2});
		if(data && data.length)
			super.push(...data);
	}
	get idx(): number {return (this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value as number)}
	get nid(): number {return (this.data[1].value as number)}
	get stepMax() {return (this.data[2].value as number & 0xf) as StepMax}
	get opMode() {return (this.data[2].value as number >> 4) as OpMode}
	get speedStep(): number {return (this.data[3].value as number) & 0x3ff}
	get direction(): boolean {return !!((this.data[3].value as number) & 0x400)}
	get directionAck(): boolean {return !!((this.data[3].value as number) & 0x800)}
	get eastWest() {return ((this.data[3].value as number) >> 12) & 3}
	get railCom() {return !!((this.data[3].value as number) & 0x4000)}
	get zimoAck() {return !!((this.data[3].value as number) & 0x8000)}
	get eStop() {return !!((this.data[4].value as number) & 0x1)}
	get cabEw() {return !!((this.data[4].value as number) & 0x2)}
	get hasTrain() {return !!((this.data[4].value as number) & 0x4)}
	get deleted() {return !!((this.data[4].value as number) & 0x80)}
	get fxCount() {return this.data[5].value as number}
	get axCount() {return this.data[6].value as number}
	get fxState()
		{return (this.data[7].value as number).toString(2).padStart(64, '0').split('').reverse().map(bit => bit === '1')}
	get owner() {return {nid: this.data[8].value as number, tick: this.data[9].value as number}}
	get trainNid() {return this.data[10].value as number}

	static fromBuffer(mode: MsgMode, nid: number, buffy: Buffer)
	{
		const idx = buffy.readUInt16LE(0);
		const locoNid = buffy.readUInt16LE(2);
		let offset = 4;
		const data: ZcanData[] = [{value: locoNid, length: 2}];
		const slices = [1, 2, 1, 1, 1, 8, 2, 4, 2];
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
				case 8:
					value = (buffy.readUInt32LE(offset+4)<<32) | buffy.readUInt32LE(offset);
					//value = Number(buffy.readBigUInt64LE(offset));
					break;
			}
			data.push({value, length});
			offset += length;
		}
		return new MsgItemListByIdxX(MsgItemListByIdxX.header(mode, nid), idx, data);
	}
}
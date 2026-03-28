import { FunctionMode, MsgMode } from "../common/enums";
import { Header, Message } from "../common/communication";
import { TrainFunction } from "../docs_entrypoint";


// export class MsgOldLocoGuiReq extends Message
// {
// 	public static header(mode: MsgMode, nid: number): Header
// 	{return {group: 0x17, cmd: 0x27, mode: mode, nid: nid}}

// 	constructor(header: Header, locoNid: number, subNid: number)
// 	{
// 		super(header);
// 		super.push({value: locoNid, length: 2});
// 		super.push({value: subNid, length: 2});
// 	}
// 	locoNid(): number {return (this.data[0].value as number)}
// 	subNid(): number {return (this.data[1].value as number)}
// }

// export class MsgOldLocoGuiRsp extends Message
// {
// 	public static header(mode: MsgMode, nid: number): Header
// 	{return {group: 0x17, cmd: 0x27, mode: mode, nid: nid}}

// 	constructor(header: Header, locoNid: number, subNid: number, group: number, name: string, imageId: number,
// 		tacho: number, speedFwd: number, speedRev: number, speedRange: number, driveType: number, era: number,
// 		country: number, functions: number[])
// 	{
// 		super(header);
// 		super.push({value: locoNid, length: 2});
// 		super.push({value: subNid, length: 2});
// 		super.push({value: group, length: 2});
// 		super.push({value: name, length: 32});
// 		super.push({value: imageId, length: 2});
// 		super.push({value: tacho, length: 2});
// 		super.push({value: speedFwd, length: 2});
// 		super.push({value: speedRev, length: 2});
// 		super.push({value: speedRange, length: 2});
// 		super.push({value: driveType, length: 2});
// 		super.push({value: era, length: 2});
// 		super.push({value: country, length: 2});
// 		functions.forEach(funk => {
// 			super.push({value: funk, length: 2});
// 		});
// 	}
// 	locoNid(): number {return (this.data[0].value as number)}
// 	subNid(): number {return (this.data[1].value as number)}
// 	group(): number {return (this.data[2].value as number)}
// 	name(): string {return (this.data[3].value as string)}
// 	imageId(): number {return (this.data[4].value as number)}
// 	tacho(): number {return (this.data[5].value as number)}
// 	speedFwd(): number {return (this.data[6].value as number)}
// 	speedRev(): number {return (this.data[7].value as number)}
// 	speedRange(): number {return (this.data[8].value as number)}
// 	driveType(): number {return (this.data[9].value as number)}
// 	era(): number {return (this.data[10].value as number)}
// 	country(): number {return (this.data[11].value as number)}
// 	functions(): Array<TrainFunction>
// 	{
// 		const rv = Array<TrainFunction>();
// 		for (let i = 12; i < this.data.length; i++) {
// 			const icon = (this.data[i].value as number);
// 			const iconString = icon === 0 ? String(i).padStart(2, '0') : String(icon);
// 			rv.push({mode: FunctionMode.switch, active: false,
// 				icon: iconString.padStart(4, icon === 0 ? '07' : '0'),
// 			});
// 		}
// 		return rv;
// 	}
// }

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
	// funModes(): Array<TrainFunction>
	// {
	// 	const rv = Array<TrainFunction>();
	// 	for (let i = 12; i < this.data.length; i++) {
	// 		const icon = (this.data[i].value as number);
	// 		const iconString = icon === 0 ? String(i).padStart(2, '0') : String(icon);
	// 		rv.push({mode: FunctionMode.switch, active: false,
	// 			icon: iconString.padStart(4, icon === 0 ? '07' : '0'),
	// 		});
	// 	}
	// 	return rv;
	// }
}
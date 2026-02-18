
import { Header, Message } from "../common/communication";
import { Ranger } from "../common/utils";
import { Direction, MaxSpeedSteps, MsgMode, OperatingMode } from "../common/enums";
import { directACKBites, directionBites, eastWestBites_, emergencyStopB, speedBites____ } from "../common/bites";


export class MsgVehicleMode extends Message
{
	public static header = (mode: MsgMode, nid: number) => {return {group: 0x2, cmd: 0x1, mode, nid}}
	public static rxDelay = () => {return this.rxTiming.now()}
	public static log: (msg: string) => void = () => {};

	private static rxTiming = new Ranger({min: 5, max: 20, now: 5});

	public static modeByte1(opMode: OperatingMode, speedSteps: MaxSpeedSteps)
	{
		const opModes = Object.values(OperatingMode);
		let rv = (speedSteps ? speedSteps : MaxSpeedSteps.UNKNOWN) as number;
		for(let i=0; i<opModes.length; i++) if(opMode === opModes[i]) {rv |= i << 4; break;}
		return rv;
	}

	constructor(header: Header, mode?: number[] | {opMode: OperatingMode, speedSteps: MaxSpeedSteps})
	{
		super(header);
		if(!mode) return;
		MsgVehicleMode.log("MsgVehicleMode.mode: " + mode);
		if(Array.isArray(mode)) for(let byte of mode.slice(0, 2)) {
			super.push({value: byte, length: 1});
			MsgVehicleMode.log("MsgVehicleMode.push: " + byte);
		} else {
			super.push({value: MsgVehicleMode.modeByte1(mode.opMode, mode.speedSteps), length: 1});
			super.push({value: 0, length: 1});
			super.push({value: 0, length: 1});
		}
	}

	rxDelay(millis: number) {MsgVehicleMode.rxTiming.set(millis)}
	trainNid(): number {return this.header.nid}

	mode(): number[] | undefined
	{
		if(this.data.length < 2) return undefined;
		return this.data.map(data => data.value as number);
	}
	speedSteps(): MaxSpeedSteps | undefined
	{
		if(this.data.length < 2) return undefined;
		const steps = (this.data[0].value as number) & 0xf;
		if (steps > 0 && steps < 6) return Object.values(MaxSpeedSteps)[steps] as MaxSpeedSteps;
		return MaxSpeedSteps.UNKNOWN;
	}
	operatingMode(): OperatingMode | undefined
	{
		if(this.data.length < 2) return undefined;
		const mode = (this.data[0].value as number) >> 4;
		if (mode > 0 && mode < 8) return Object.values(OperatingMode)[mode];
		return OperatingMode.UNKNOWN;
	}
}

export class MsgVehicleSpeed extends Message
{
	public static header = (mode: MsgMode, nid: number) => {return {group: 0x2, cmd: 0x2, mode, nid}}
	public static rxDelay = () => {return this.rxTiming.now()}
	public static log: (msg: string) => void = () => {};
	private static rxTiming = new Ranger({min: 5, max: 20, now: 5});

	constructor(header: Header, speedAndDirection?: number, divisor?: number)
	{
		super(header);
		if(header.mode === MsgMode.REQ) return;
		super.push({value: speedAndDirection || 0, length: 2});
		super.push({value: divisor || 0, length: 1});
		super.push({value: 0, length: 1});
	}

	rxDelay(millis: number) {MsgVehicleSpeed.rxTiming.set(millis)}
	trainNid(): number {return this.header.nid}
	divisor(): number {return this.data[1].value as number;}
	speedStep(): number {return (this.data[0].value as number) & speedBites____;}
	direction(): boolean {return ((this.data[0].value as number) & directionBites) === directionBites;}
	directionAck(): boolean {return ((this.data[0].value as number) & directACKBites) === directACKBites;}
	forward(): boolean {return !this.direction() && !this.directionAck();}
	eastWest(): number {return ((this.data[0].value as number) & eastWestBites_) >> 12;}
	emergencyStop(): boolean {return ((this.data[0].value as number) & emergencyStopB) === emergencyStopB;}

	public static fromBuffer(mode: MsgMode, buffer: Buffer)
	{
		const nid = buffer.readUInt16LE(0);
		const speedAndDir = buffer.readUInt16LE(2);
		const divisor = buffer.readUint8(4);
		const msg = new MsgVehicleSpeed(MsgVehicleSpeed.header(mode, nid), speedAndDir, divisor);
		return msg;
	}

	public static speedAndDir(speed: number, forward: boolean = true, emergencyStop: boolean = false,
		eastWest: Direction = Direction.UNDEFINED)
	{
		const direction = Number(!forward);
		const stop = Number(emergencyStop);
		return speed | (direction << 10) | (eastWest << 12) | (stop << 15);
	};
}
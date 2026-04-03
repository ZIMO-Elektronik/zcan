/* eslint-disable  @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {CallFunctionData} from '../common/models';
import {Direction, Manual, MaxSpeedSteps, MsgMode, OperatingMode, SpecialFxNr} from '../common/enums';
import {combineSpeedAndDirection} from '../common/speedUtils';
import { Query } from '../common/communication';
import { MsgSpecialFx, MsgVehicleLastCtl, MsgVehicleMode, MsgVehicleSpeed, MsgVehicleState } from './vehicleMsg';

/**
 *
 * @category Groups
 */
export default class VehicleGroup
{
	public readonly onVehicleState = new Subject<MsgVehicleState>();
	public readonly onVehicleLastCtl = new Subject<MsgVehicleLastCtl>();
	public readonly onVehicleMode = new Subject<MsgVehicleMode>();
	public readonly onVehicleSpeed = new Subject<MsgVehicleSpeed>();
	public readonly onCallFunction = new Subject<CallFunctionData>();
	public readonly onCallSpecialFunction = new Subject<MsgSpecialFx>();

	private stateQ: Query<MsgVehicleState> | undefined = undefined;
	private lastCtlQ: Query<MsgVehicleLastCtl> | undefined = undefined;
	private modeQ: Query<MsgVehicleMode> | undefined = undefined;
	private speedQ: Query<MsgVehicleSpeed> | undefined = undefined;
	private sfxQ: Query<MsgSpecialFx> | undefined = undefined;

	private mx10: MX10;

	constructor(mx10: MX10) {this.mx10 = mx10}

	//0x02.0x00
	async getState(nid: number)
	{
		if(this.stateQ !== undefined && !await this.stateQ.lock()) {
			this.mx10.logInfo.next("mx10.getVehicleState: failed to acquire lock");
			return undefined;
		}
		this.stateQ = new Query(MsgVehicleState.header(MsgMode.REQ, nid), this.onVehicleState);
		this.stateQ.log = (msg) => {this.mx10.logInfo.next(msg)};
		this.stateQ.tx = ((header) => {
			const msg = new MsgVehicleState(header);
			// this.mx10.logInfo.next('state query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.stateQ.match = ((msg) => {
			// this.mx10.logInfo.next('state query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === nid);
		})
		const rv = await this.stateQ.run();
		// this.mx10.logInfo.next("mx10.getVehicleState.rv: " + JSON.stringify(rv));
		this.stateQ.unlock();
		this.stateQ = undefined;
		return rv;
	}

	//0x02.0x00
	async getLastController(locoNid: number, type: number = 1)
	{
		if(this.lastCtlQ !== undefined && !await this.lastCtlQ.lock()) {
			this.mx10.logInfo.next("mx10.getVehicleLastCtl: failed to acquire lock");
			return undefined;
		}
		this.lastCtlQ = new Query(MsgVehicleLastCtl.header(MsgMode.REQ, locoNid), this.onVehicleLastCtl);
		this.lastCtlQ.log = (msg) => {this.mx10.logInfo.next(msg)};
		this.lastCtlQ.tx = ((header) => {
			const msg = new MsgVehicleLastCtl(header, type);
			this.mx10.logInfo.next('lastCtl query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.lastCtlQ.match = ((msg) => {
			this.mx10.logInfo.next('lastCtl query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === locoNid);
		})
		const rv = await this.lastCtlQ.run();
		this.mx10.logInfo.next("mx10.getVehicleLastCtl.rv: " + JSON.stringify(rv));
		this.lastCtlQ.unlock();
		this.lastCtlQ = undefined;
		return rv;
	}

	async getMode(trainNid: number)
	{
		if(this.modeQ !== undefined && !await this.modeQ.lock()) {
			this.mx10.logInfo.next("mx10.getVehicleMode: failed to acquire lock");
			return undefined;
		}
		this.modeQ = new Query(MsgVehicleMode.header(MsgMode.REQ, trainNid), this.onVehicleMode);
		this.modeQ.log = ((msg) => {this.mx10.logInfo.next(msg)});
		this.modeQ.tx = ((header) => {
			const msg = new MsgVehicleMode(header);
			// this.mx10.logInfo.next('mode query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modeQ.match = ((msg) => {
			// this.mx10.logInfo.next('mode query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === trainNid);
		})
		const rv = await this.modeQ.run();
		// this.mx10.logInfo.next("mx10.getVehicleMode.rv: " + JSON.stringify(rv));
		this.modeQ.unlock();
		this.modeQ = undefined;
		return rv;
	}

	async setMode(trainNid: number, opMode: OperatingMode, speedSteps: MaxSpeedSteps)
	{
		MsgVehicleMode.log = (msg) => {this.mx10.logInfo.next(msg)};
		if(this.modeQ !== undefined && !await this.modeQ.lock()) {
			this.mx10.logInfo.next("mx10.setVehicleMode: failed to acquire lock");
			return undefined;
		}
		this.modeQ = new Query(MsgVehicleMode.header(MsgMode.CMD, trainNid), this.onVehicleMode);
		this.modeQ.log = (msg) => {this.mx10.logInfo.next(msg)};
		this.modeQ.tx = ((header) => {
			const msg = new MsgVehicleMode(header, {opMode, speedSteps});
			// this.mx10.logInfo.next('mode query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modeQ.match = ((msg) => {
			// this.mx10.logInfo.next('mode query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === trainNid);
		})
		const rv = await this.modeQ.run(MsgVehicleMode.rxDelay());
		// this.mx10.logInfo.next("mx10.setVehicleMode.rv: " + JSON.stringify(rv));
		this.modeQ.unlock();
		this.modeQ = undefined;
		return rv;
	}

	async getSpeed(trainNid: number)
	{
		if(this.speedQ !== undefined && !await this.speedQ.lock()) {
			this.mx10.logInfo.next("mx10.getVehicleSpeed: failed to acquire lock");
			return undefined;
		}
		this.speedQ = new Query(MsgVehicleSpeed.header(MsgMode.REQ, trainNid), this.onVehicleSpeed);
		this.speedQ.log = ((msg) => {this.mx10.logInfo.next(msg)});
		this.speedQ.tx = ((header) => {
			const msg = new MsgVehicleSpeed(header);
			// this.mx10.logInfo.next('speed query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.speedQ.match = ((msg) => {
			// this.mx10.logInfo.next('speed query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === trainNid);
		})
		const rv = await this.speedQ.run();
		// this.mx10.logInfo.next("mx10.getVehicleSpeed.rv: " + JSON.stringify(rv));
		this.speedQ.unlock();
		this.speedQ = undefined;
		return rv;
	}

	async setSpeed(trainNid: number, speedStep: number, divisor: number = 0, forward: boolean = true,
		emergencyStop: boolean = false, eastWest: Direction = Direction.UNDEFINED)
	{
		MsgVehicleSpeed.log = (msg) => {this.mx10.logInfo.next(msg)};
		if(this.speedQ !== undefined && !await this.speedQ.lock()) {
			this.mx10.logInfo.next("mx10.setVehicleSpeed: failed to acquire lock");
			return undefined;
		}
		this.speedQ = new Query(MsgVehicleSpeed.header(MsgMode.CMD, trainNid), this.onVehicleSpeed);
		this.speedQ.log = (msg) => {this.mx10.logInfo.next(msg)};
		this.speedQ.tx = ((header) => {
			const speedAndDir= MsgVehicleSpeed.speedAndDir(speedStep, forward, emergencyStop, eastWest);
			const msg = new MsgVehicleSpeed(header, speedAndDir, divisor);
			// this.mx10.logInfo.next('speed query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.speedQ.match = ((msg) => {
			// this.mx10.logInfo.next('speed query rx: ' + JSON.stringify(msg));
			return (msg.trainNid() === trainNid);
		})
		const rv = await this.speedQ.run(MsgVehicleSpeed.rxDelay());
		// this.mx10.logInfo.next("mx10.setVehicleSpeed.rv: " + JSON.stringify(rv));
		this.speedQ.unlock();
		this.speedQ = undefined;
		return rv;
	}

	changeSpeed(vehicleAddress: number, speedStep: number, forward: boolean, eastWest?: Direction, emergencyStop?: boolean)
	{
		const speedAndDirection = combineSpeedAndDirection(speedStep, forward, eastWest, emergencyStop);
		this.mx10.sendData(0x02, 0x02, [
			{value: vehicleAddress, length: 2},
			{value: speedAndDirection, length: 2},
			{value: 0x0000, length: 2},
		]);
	}

	callFunction(vehicleAddress: number, functionId: number, functionStatus: boolean)
	{
		this.mx10.sendData(0x02, 0x04, [
			{value: vehicleAddress, length: 2},
			{value: functionId, length: 2},
			{value: Number(functionStatus), length: 2},
		]);
	}

	async getSpecialFx(nid: number, sfxNr: SpecialFxNr)
	{
		if(this.sfxQ !== undefined && !await this.sfxQ.lock()) {
			this.mx10.logInfo.next("mx10.getSpecialFx: failed to acquire lock");
			return undefined;
		}
		this.sfxQ = new Query(MsgSpecialFx.header(MsgMode.REQ, nid), this.onCallSpecialFunction);
		this.sfxQ.tx = ((header) => {
			const msg = new MsgSpecialFx(header, sfxNr);
			// this.mx10.logInfo.next('sfx query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.sfxQ.match = ((msg) => {
			// this.mx10.logInfo.next('sfx query rx: ' + JSON.stringify(msg));
			return (msg.nid() === nid);
		})
		const rv = await this.sfxQ.run();
		this.mx10.logInfo.next("mx10.getSpecialFx.rv: " + JSON.stringify(rv));
		this.sfxQ.unlock();
		this.sfxQ = undefined;
		return rv;
	}

	async setSpecialFx(nid: number, sfxNr: SpecialFxNr, state: number)
	{
		if(this.sfxQ !== undefined && !await this.sfxQ.lock()) {
			this.mx10.logInfo.next("mx10.setSpecialFx: failed to acquire lock");
			return undefined;
		}
		this.sfxQ = new Query(MsgSpecialFx.header(MsgMode.CMD, nid), this.onCallSpecialFunction);
		this.sfxQ.tx = ((header) => {
			const msg = new MsgSpecialFx(header, sfxNr, state);
			// this.mx10.logInfo.next('sfx query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.sfxQ.match = ((msg) => {
			// this.mx10.logInfo.next('sfx query rx: ' + JSON.stringify(msg));
			return (msg.nid() === nid);
		})
		const rv = await this.sfxQ.run();
		this.mx10.logInfo.next("mx10.setSpecialFx.rv: " + JSON.stringify(rv));
		this.sfxQ.unlock();
		this.sfxQ = undefined;
		return rv;
	}

	// changeSpecialFunction(vehicleAddress: number, specialFunctionMode: SpecialFxNr,
	// 	specialFunctionStatus: Manual | Shunting| Direction) {
	// 	this.mx10.sendData(0x02, 0x05, [
	// 		{value: vehicleAddress, length: 2},
	// 		{value: specialFunctionMode, length: 2},
	// 		{value: specialFunctionStatus, length: 2},
	// 	]);
	// }

	// 0x02.0x10
	activeModeTrain(vehicleAddress: number) {
		return this.mx10.sendData(0x02, 0x10, [
			{value: vehicleAddress, length: 2},
			{value: 0x01, length: 2},
		], 0b01);
	}

	activeModeTakeOver(vehicleAddress: number) {
		return this.mx10.sendData(0x02, 0x10, [
			{value: vehicleAddress, length: 2},
			{value: 0x10, length: 2},
		], 0b01);
	}

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		// this.mx10.logInfo.next("mx10.vehicleGroup.parse: " + command + "," + nid + "," + JSON.stringify(buffer));
		switch (command) {
			case 0x00: this.parseVehicleState(size, mode, nid, buffer); break;
			case 0x01: this.parseVehicleMode(size, mode, nid, buffer); break;
			case 0x02: this.parseVehicleSpeed(size, mode, nid, buffer); break;
			case 0x04: this.parseVehicleFunction(size, mode, nid, buffer); break;
			case 0x05: this.parseVehicleSpecialFunction(size, mode, nid, buffer); break;
			case 0x12: this.parseVehicleLastCtl(size, mode, nid, buffer); break;
		}
	}

	// 0x02.0x00
	private parseVehicleState( size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onVehicleState.observed)
			return;
		const msg = MsgVehicleState.fromBuffer(mode, buffer);
		// this.mx10.logInfo.next('parseVehicleState' + JSON.stringify(buffer));
		this.onVehicleState.next(msg);
	}

	// 0x02.0x01
	private parseVehicleMode(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onVehicleMode.observed) {
			const NID = buffer.readUInt16LE(0);
			const vMode = [buffer.readUInt8(2), buffer.readUInt8(3), buffer.readUInt8(4)];
			// this.mx10.logInfo.next("parseVehicleMode: " + NID + " = " + JSON.stringify(vMode));
			this.onVehicleMode.next(new MsgVehicleMode(MsgVehicleMode.header(mode, NID), vMode));
		}
	}

	// 0x02.0x02
	private parseVehicleSpeed(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onVehicleSpeed.observed)
			return;

		const msg = MsgVehicleSpeed.fromBuffer(mode, buffer);
		// this.mx10.logInfo.next('parseVehicleSpeed: ' + JSON.stringify(msg));
		this.onVehicleSpeed.next(msg);
	}

	// 0x02.0x04
	private parseVehicleFunction(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onCallFunction.observed) {
			const NID = buffer.readUInt16LE(0);
			const functionNumber = buffer.readUInt16LE(2);
			const functionState = buffer.readUInt16LE(4);
			const functionActive = functionState !== 0x00;

			this.onCallFunction.next({
				nid: NID,
				functionNumber,
				functionState: functionActive,
			});
		}
	}

	// 0x02.0x05
	private parseVehicleSpecialFunction(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onCallSpecialFunction.observed)
			return;
		this.onCallSpecialFunction.next(MsgSpecialFx.fromBuffer(mode, buffer));
	}

	// 0x02.0x12
	private parseVehicleLastCtl( size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onVehicleLastCtl.observed)
			return;

		const NID = buffer.readUInt16LE(0);
		const type = buffer.readUInt16LE(2);
		const ctlNid = buffer.readUInt16LE(4);
		const seconds = buffer.readUInt16LE(6);

		const msg = new MsgVehicleLastCtl(MsgVehicleLastCtl.header(mode, NID), type, ctlNid, seconds);
		this.onVehicleLastCtl.next(msg);
	}
}

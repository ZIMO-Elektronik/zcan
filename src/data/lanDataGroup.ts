// 0x17
import MX10 from '../MX10';
import {FunctionMode, FxConfigType, getOperatingMode, MsgMode, OperatingMode} from '../common/enums';
import {DataNameExtendedData, DataValueExtendedData, LocoGuiMXExtended, LocoSpeedTabExtended, SpeedTabData,
	Train, TrainFlags, TrainFunction} from '../common/models';
import {Subject} from 'rxjs';
import {parseSpeed} from '../common/speedUtils';
import ExtendedASCII from '../common/extendedAscii';
import {manualModeB, shuntingFunctionB} from '../common/bites';
import {Query, ZcanDataArray} from '../common/communication';
import { MsgLocoGuiReq, MsgLocoGuiRsp } from './lanDataMsg';

/**
 *
 * @category Groups
 */
export default class LanDataGroup
{
	public readonly onLocoGuiExtended = new Subject<MsgLocoGuiRsp>();
	// public readonly onOldLocoGuiExtended = new Subject<MsgOldLocoGuiRsp>();
	public readonly onDataValueExtended = new Subject<DataValueExtendedData>();
	public readonly onDataNameExtended = new Subject<DataNameExtendedData>();
	public readonly onLocoSpeedTabExtended = new Subject<LocoSpeedTabExtended>();

	private locoGuiQ: Query<MsgLocoGuiRsp> | undefined = undefined;
	// private oldLocoGuiQ: Query<MsgOldLocoGuiRsp> | undefined = undefined;

	private mx10: MX10;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	dataValueExtended(NID: number)
	{
		this.mx10.sendData(0x17, 0x08, [
			{value: this.mx10.mx10NID, length: 2},
			{value: NID, length: 2},
			{value: 1, length: 2},
		], 0b00);
	}

	dataNameExtended(NID: number)
	{
		this.mx10.sendData(0x17, 0x10, [
			{value: NID, length: 2},
			{value: 0, length: 2},
		], 0b00);
	}

	renameDataExtended(NID: number, type: number, val1: number, val2: number, val3: number, name: string)
	{
		this.mx10.sendData(0x17, 0x10, [
			{value: NID, length: 2},
			{value: type, length: 2},
			{value: val1, length: 4},
			{value: val2, length: 4},
			{value: val3, length: 4},
			{value: name, length: name.length},
			{value: 0, length: 1},
		], 0b01);
	}

	/**
	 * Send Data Fx Config CMD
	 * @param nid Loco NID
	 * @param fx Function button index
	 * @param type 
	 * @param addr Function's destination address, same as loco nid
	 * @param mode Function mode ... toggle / moment / timeout
	 * @param icon Function icon id
	 */
	itemFxConfig(nid: number, fx: number, type: FxConfigType, addr: number, mode: number, icon: number)
	{
		this.mx10.sendData(0x17, 0x15, [
			{value: nid, length: 2},
			{value: fx, length: 2},
			{value: type, length: 2},
			{value: addr, length: 2},
			{value: mode, length: 2},
			{value: icon, length: 2},
		]);
	}

	async getLocoGuiExtended(nid: number): Promise<MsgLocoGuiRsp | undefined>
	{
		if(this.locoGuiQ !== undefined && !await this.locoGuiQ.lock()) {
			this.mx10.logInfo.next("mx10.locoGuiExtended: failed to acquire lock");
			return undefined;
		}
		this.locoGuiQ = new Query(MsgLocoGuiReq.header(MsgMode.REQ, this.mx10.mx10NID), this.onLocoGuiExtended);
		this.locoGuiQ.log = ((msg) => {
			this.mx10.logInfo.next(msg);
		});
		this.locoGuiQ.tx = ((header) => {
			const msg = new MsgLocoGuiReq(header, nid, 0);
			// this.mx10.logInfo.next('locoGuiExtended query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.locoGuiQ.match = ((msg) => {
			// this.mx10.logInfo.next('locoGuiExtended query rx: ' + JSON.stringify(msg));
			return (msg.locoNid() === nid);
		})
		const rv = await this.locoGuiQ.run();
		// this.mx10.logInfo.next("mx10.locoGuiExtended.rv: " + JSON.stringify(rv));
		this.locoGuiQ.unlock();
		this.locoGuiQ = undefined;
		return rv;
	}

	async setLocoGuiExtended(loco: Train): Promise<MsgLocoGuiRsp | undefined>
	{
		if(this.locoGuiQ !== undefined && !await this.locoGuiQ.lock()) {
			this.mx10.logInfo.next("mx10.locoGuiExtended: failed to acquire lock");
			return undefined;
		}
		this.locoGuiQ = new Query(MsgLocoGuiReq.header(MsgMode.CMD, this.mx10.myNID), this.onLocoGuiExtended);
		this.locoGuiQ.log = ((msg) => {
			this.mx10.logInfo.next(msg);
		});
		this.locoGuiQ.tx = ((header) => {
			const msg = new MsgLocoGuiRsp(header, loco.nid, loco.subId, 0, 0, loco.group, loco.name,
				loco.image ? parseInt(loco.image) : 0, 0, parseInt(loco.tacho), 0, loco.speedFwd, loco.speedRev,
				loco.speedRange, loco.driveType, parseInt(loco.era), loco.countryCode,
				loco.functions.map(fun => fun.icon ? parseInt(fun.icon) : 0), loco.functions.map(fun => fun.mode)
			);
			// this.mx10.logInfo.next('locoGuiExtended query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.locoGuiQ.match = ((msg) => {
			// this.mx10.logInfo.next('locoGuiExtended query rx: ' + JSON.stringify(msg));
			return (msg.locoNid() === loco.nid);
		})
		this.locoGuiQ.subscribe(false);
		const rv = await this.locoGuiQ.run(40);
		// this.mx10.logInfo.next("mx10.locoGuiExtended.rv: " + JSON.stringify(rv));
		this.locoGuiQ.unlock();
		this.locoGuiQ = undefined;
		return rv;
	}

	// async oldLocoGuiExtended(nid: number): Promise<MsgOldLocoGuiRsp | undefined>
	// {
	// 	if(this.oldLocoGuiQ !== undefined && !await this.oldLocoGuiQ.lock()) {
	// 		this.mx10.logInfo.next("mx10.locoGuiExtended: failed to acquire lock");
	// 		return undefined;
	// 	}
	// 	this.oldLocoGuiQ = new Query(MsgOldLocoGuiReq.header(MsgMode.REQ, this.mx10.mx10NID), this.onOldLocoGuiExtended);
	// 	this.oldLocoGuiQ.log = ((msg) => {
	// 		this.mx10.logInfo.next(msg);
	// 	});
	// 	this.oldLocoGuiQ.tx = ((header) => {
	// 		const msg = new MsgOldLocoGuiReq(header, nid, 0);
	// 		this.mx10.logInfo.next('locoGuiExtended query tx: ' + JSON.stringify(msg));
	// 		this.mx10.sendMsg(msg);
	// 	});
	// 	this.oldLocoGuiQ.match = ((msg) => {
	// 		this.mx10.logInfo.next('locoGuiExtended query rx: ' + JSON.stringify(msg));
	// 		return (msg.locoNid() === nid);
	// 	})
	// 	const rv = await this.oldLocoGuiQ.run();
	// 	this.mx10.logInfo.next("mx10.locoGuiExtended.rv: " + JSON.stringify(rv));
	// 	this.oldLocoGuiQ.unlock();
	// 	this.oldLocoGuiQ = undefined;
	// 	return rv;
	// }

	// locoGuiExtended(NID: number)
	// {
	// 	this.mx10.sendData(0x17, 0x27, [
	// 		{value: this.mx10.mx10NID, length: 2},
	// 		{value: NID, length: 2},
	// 		{value: 0, length: 2},
	// 	], 0b00);
	// }

	// locoGuiMXExtended(NID: number)
	// {
	// 	this.mx10.sendData(0x17,0x28, [
	// 		{value: this.mx10.mx10NID, length: 2},
	// 		{value: NID, length: 2},
	// 		{value: 0, length: 2},
	// 	], 0b00);
	// }

	locoSpeedTapExtended(NID: number)
	{
		this.mx10.sendData(0x17, 0x19, [
			{value: this.mx10.mx10NID, length: 2},
			{value: NID, length: 2},
			{value: 0, length: 1},
			{value: 0, length: 1},
		], 0b00);
	}

	// mxUpdateFnIcons(destructuredBuffer: ZcanDataArray)
	// {
	// 	this.mx10.sendData(0x17, 0x28, destructuredBuffer, 0b01);
	// }

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command)
		{
			case 0x08:
				this.parseDataValueExtended(size, mode, nid, buffer);
				break;
			case 0x10:
				this.parseDataNameExtended(size, mode, nid, buffer);
				break;
			// case 0x27:
			// 	this.parseOldLocoGuiExtended(size, mode, nid, buffer);
			// 	break;
			case 0x28:
				this.parseLocoGuiExtended(size, mode, nid, buffer);
				break;
			case 0x19:
				this.parseLocoSpeedTabExtended(size, mode, nid, buffer);
				break;
			default:
				this.mx10.logInfo.next('lanDataGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
		}
	}

	// 0x17.0x08
	private parseDataValueExtended(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onDataValueExtended.observed)
			return;

		const NID = buffer.readUInt16LE(0);
		const deletedFlag = buffer.readUInt8(4);
		const flagsBytes = buffer.readUInt32LE(4);
		const trackMode = buffer.readUInt8(24);
		const functionCount = buffer.readUInt8(25);
		const speedAndDirection = buffer.readUInt16LE(44);
		const {speedStep, forward, eastWest, emergencyStop} = parseSpeed(speedAndDirection);
		const operatingMode = getOperatingMode(trackMode);
		const flags = this.parseFlags(flagsBytes);

		let functions = buffer.readUInt32LE(46);
		const functionsStates = [];
		for (let i = 0; i < 31; i++) {
			const active = (functions & 1) == 1;
			functionsStates.push(active);
			functions = functions >> 1;
		}

		const specialFunc = buffer.readUInt32LE(50);
		const shuntingFunction = specialFunc & shuntingFunctionB;
		const manualMode = (specialFunc & manualModeB) >> 4;
		const deleted = this.parseDeleted(deletedFlag);

		this.onDataValueExtended.next({nid: NID, flags, functionCount, speedStep, forward, eastWest,
			emergencyStop, operatingMode, functionsStates, shuntingFunction, manualMode, deleted});
	}

	// 0x17.0x10
	private parseDataNameExtended(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onDataNameExtended.observed)
			return;

		const NID = buffer.readUInt16LE(0);
		const type = buffer.readUInt16LE(2);
		const val1 = buffer.readUInt32LE(4);
		const val2 = buffer.readUInt32LE(8);
		const val3 = buffer.readUInt32LE(12);
		const name = ExtendedASCII.byte2str(buffer.subarray(16, 63));

		this.onDataNameExtended.next({nid: NID, name});
	}

	// 0x17.0x28
	private parseLocoGuiExtended(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onLocoGuiExtended.observed)
			return;

		// this.mx10.logInfo.next('parseLocoGuiExtended: ' + JSON.stringify(buffer));

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
		const speedFwd = buffer.readUInt16LE(56);
		const speedRev = buffer.readUInt16LE(58);
		const speedRank = buffer.readUInt16LE(60);
		const driveType = buffer.readUInt16LE(62);
		const era = buffer.readUInt16LE(64);
		const countryCode = buffer.readUInt16LE(66);
		const funImg: number[] = [];
		for (let i = 0; i < 64; i++) {
			const fun = buffer.readUInt16LE(68 + 2*i);
			funImg.push(fun);
		}
		const funMode: number[] = [];
		for (let i = 0; i < 64; i++) {
			const fun = buffer.readUInt16LE(132 + 2*i);
			funMode.push(fun);
		}

		const msg = new MsgLocoGuiRsp(MsgLocoGuiRsp.header(mode, nid), NID, SubID, version, flags, group, name,
			imageId, imageCrc, tachoId, tachoCrc, speedFwd, speedRev, speedRank, driveType, era, countryCode,
			funImg, funMode);
		
		this.onLocoGuiExtended.next(msg);
	}

	// 0x17.0x19
	private parseLocoSpeedTabExtended(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onLocoSpeedTabExtended.observed)
			return;

		const setDBat6 = 5;
		const bufferLengthOfSpeedTab = 24;
		const SrcID = buffer.readUInt16LE(0);
		const NID = buffer.readUInt16LE(2);
		const DBat6 = buffer.readUInt8(5);
		// const speedStep0 = buffer.readUInt16LE(6);
		// const speed0 = buffer.readUInt16LE(8);
		// const speedStep1 = buffer.readUInt16LE(10);
		// const speed1 = buffer.readUInt16LE(12);
		// const speedStep2 = buffer.readUInt16LE(14);
		// const speed2 = buffer.readUInt16LE(16);
		// const speedStep3 = buffer.readUInt16LE(18);
		// const speed3 = buffer.readUInt16LE(20);
		// const speedStep4 = buffer.readUInt16LE(22);
		// const speed4 = buffer.readUInt16LE(24);

		let locoSpeedTab: Array<SpeedTabData> | undefined = undefined;

		if (DBat6 !== setDBat6)
			locoSpeedTab = undefined;
		else
		{
			locoSpeedTab = [];
			for (let i = 0; i < 4; i++)
			{
				const offset = 6 + i * 4;
				if (bufferLengthOfSpeedTab >= offset + 2) {
					const speedStep = buffer.readUInt16LE(offset);
					const speed = buffer.readUInt16LE(offset + 2);
					locoSpeedTab.push({id: i + 1, speedStep: speedStep, speed: speed});
				} else {
					// eslint-disable-next-line no-console
					console.warn(`Train with id:${NID} has wrong speedStepTab buffer`);
					break;
				}
			}
		}
		this.onLocoSpeedTabExtended.next({srcid: SrcID, nid: NID, dbat6: DBat6, speedTab: locoSpeedTab});
	}

	private parseEra(eraString: number)
	{
		switch (eraString & 0xf0)
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

	private parseFlags(flagsNumber: number): TrainFlags
	{
		return {deleted: flagsNumber >> 31 === 1};
	}

	private parseDeleted(parseDeletedFlag: number)
	{
		return parseDeletedFlag === 1;
	}

	private destructureBuffer(buffer: Buffer): ZcanDataArray
	{
		const values = [];
		for (let i = 0; i < buffer.length; i += 2) {
			values.push({
				value: buffer.readUInt16LE(i),
				length: 2,
			});
		}
		return values;
	}
}

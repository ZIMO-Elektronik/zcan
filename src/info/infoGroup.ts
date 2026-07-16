import {Buffer} from 'buffer';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {Query} from '../common/communication';
import {BidiType, ModInfoType, MsgMode} from '../common/enums';
import {MsgBidiDir, MsgBidiInfo, MsgBidiSpeed, MsgModInfo} from './infoMsg';

/**
 *
 * @category Groups
 */
export default class InfoGroup
{
	private mx10: MX10;

	public readonly onBidiDir = new Subject<MsgBidiDir>();
	public readonly onBidiSpeed = new Subject<MsgBidiSpeed>();
	public readonly onBidiInfo = new Subject<MsgBidiInfo>();
	public readonly onModuleInfoChange = new Subject<MsgModInfo>();

	private modInfoQ: Query<MsgModInfo> | undefined = undefined;
	private bidiQ: Query<MsgBidiInfo> | undefined = undefined;
	private bidiDirQ: Query<MsgBidiDir> | undefined = undefined;
	private bidiSpeedQ: Query<MsgBidiSpeed> | undefined = undefined;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	async getModuleInfo(nid: number, type: ModInfoType | number): Promise<MsgModInfo | undefined>
	{
		if(this.modInfoQ !== undefined && !await this.modInfoQ.lock()) {
			this.mx10.logInfo.next("mx10.getModuleInfo: failed to acquire lock");
			return undefined;
		}
		this.modInfoQ = new Query(MsgModInfo.header(MsgMode.REQ, nid), this.onModuleInfoChange);
		this.modInfoQ.log = ((msg) => {
			this.mx10.logInfo.next(msg);
		});
		this.modInfoQ.tx = ((header) => {
			const msg = new MsgModInfo(header, type);
			this.mx10.logInfo.next('mx10 query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modInfoQ.match = ((msg) => {
			this.mx10.logInfo.next('mx10 query rx: ' + JSON.stringify(msg));
			return (msg.type() === type);
		})
		// this.modInfoQ.subscribe();
		const rv = await this.modInfoQ.run();
		this.mx10.logInfo.next("mx10.getModuleInfo.rv: " + JSON.stringify(rv));
		this.modInfoQ.unlock();
		this.modInfoQ = undefined;
		return rv;
	}

	async getBidiDir(nid: number): Promise<MsgBidiDir | undefined>
	{
		if(this.bidiDirQ !== undefined && !await this.bidiDirQ.lock()) {
			this.mx10.logInfo.next("mx10.getBidiDir: failed to acquire lock");
			return undefined;
		}
		this.bidiDirQ = new Query(MsgBidiInfo.header(MsgMode.REQ, nid), this.onBidiDir);
		this.bidiDirQ.tx = ((header) => {
			const msg = new MsgBidiSpeed(header, nid);
			this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.bidiDirQ.subscribe(false);
		const rv = await this.bidiDirQ.run();
		this.mx10.logInfo.next("mx10.getBidiDir.rv: " + JSON.stringify(rv));
		this.bidiDirQ.unlock();
		this.bidiDirQ = undefined;
		return rv;
	}

	async getBidiSpeed(nid: number): Promise<MsgBidiSpeed | undefined>
	{
		if(this.bidiSpeedQ !== undefined && !await this.bidiSpeedQ.lock()) {
			this.mx10.logInfo.next("mx10.getBidiSpeed: failed to acquire lock");
			return undefined;
		}
		this.bidiSpeedQ = new Query(MsgBidiInfo.header(MsgMode.REQ, nid), this.onBidiSpeed);
		this.bidiSpeedQ.tx = ((header) => {
			const msg = new MsgBidiSpeed(header, nid);
			this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.bidiSpeedQ.subscribe(false);
		const rv = await this.bidiSpeedQ.run();
		this.mx10.logInfo.next("mx10.getBidiSpeed.rv: " + JSON.stringify(rv));
		this.bidiSpeedQ.unlock();
		this.bidiSpeedQ = undefined;
		return rv;
	}

	async getBidiInfo(locoNid: number, type: BidiType): Promise<MsgBidiInfo | undefined>
	{
		if(this.bidiQ !== undefined && !await this.bidiQ.lock()) {
			this.mx10.logInfo.next("mx10.getBidiInfo: failed to acquire lock");
			return undefined;
		}
		this.bidiQ = new Query(MsgBidiInfo.header(MsgMode.REQ, locoNid), this.onBidiInfo);
		this.bidiQ.tx = ((header) => {
			const msg = new MsgBidiInfo(header, type, locoNid);
			this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.bidiQ.match = ((msg) => {
			this.mx10.logInfo.next('bidi query rx: ' + JSON.stringify(msg));
			return (msg.type === type);
		})
		this.bidiQ.subscribe(false);
		const rv = await this.bidiQ.run();
		this.mx10.logInfo.next("mx10.getBidiInfo.rv: " + JSON.stringify(rv));
		this.bidiQ.unlock();
		this.bidiQ = undefined;
		return rv;
	}

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command) {
			case 0x05:
				this.parseBidiInfo(size, mode, nid, buffer);
				break;
			case 0x08:
				this.parseModuleInfo(size, mode, nid, buffer);
				break;
			default:
				this.mx10.logInfo.next('infoGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
		}
	}

	private parseModuleInfo(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onModuleInfoChange.observed) {
			const NID = buffer.readUInt16LE(0);
			const type = buffer.readUInt16LE(2);
			const info = buffer.readUInt32LE(4);
			const msg = new MsgModInfo(MsgModInfo.header(mode, NID), type, [{value: info, length: 4}]);
			// this.mx10.logInfo.next('onModuleInfoChange <- ' + JSON.stringify(msg));
			this.onModuleInfoChange.next(msg);
		}
	}

	private parseBidiInfo(size: number, mode: number, nid: number, buffer: Buffer)
	{
		const NID = buffer.readUInt16LE(0);
		const type = buffer.readUInt16LE(2);
		const info = buffer.readUInt32LE(4);

		const msg = MsgBidiInfo.fromBuffer(mode, buffer);

		switch(type)
		{
			case BidiType.DIRECTION:
				this.onBidiDir.next(/*MsgBidiDir.fromBuffer(mode, buffer)*/msg as MsgBidiDir);
				break;
			case BidiType.SPEED_REPORT:
				this.onBidiSpeed.next(msg as MsgBidiSpeed);
				break;
			default:
				this.onBidiInfo.next(msg as MsgBidiInfo);
				break;
		}
	}

	// private parseEastWest(data: number)
	// {
	// 	if ((data & 0x02) == 0x02)
	// 		return Direction.EAST;
	// 	return Direction.WEST;
	// }

	// private parseDirChange(data: number)
	// {
	// 	return (data & 0x04) == 0x04;
	// }

	// private parseFwdRev(data: number)
	// {
	// 	if ((data & 0x01) == 0)
	// 		return ForwardOrReverse.REVERSE;
	// 	return ForwardOrReverse.FORWARD;
	// }
	// private parseDirectionConfirm(data: number)
	// {
	// 	return (data & 0x08) == 0x08;
	// }
}

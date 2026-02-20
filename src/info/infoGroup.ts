import {Buffer} from 'buffer';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {Query} from '../common/communication';
import {BidiInfoData, BidiDirectionData} from '../common/models';
import {BidiType, Direction, ForwardOrReverse, ModInfoType, MsgMode} from '../common/enums';
import { MsgModInfo } from './infoMsg';

/**
 *
 * @category Groups
 */
export default class InfoGroup
{
	private mx10: MX10;

	public readonly onBidiInfoChange = new Subject<BidiInfoData>();
	public readonly onModuleInfoChange = new Subject<MsgModInfo>();

	private modInfoQ: Query<MsgModInfo> | undefined = undefined;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	async getModuleInfo(nid: number, type: ModInfoType | number): Promise<MsgModInfo | undefined>
	{
		if(this.modInfoQ !== undefined && !await this.modInfoQ.lock()) {
			this.mx10.log.next("mx10.getModuleInfo: failed to acquire lock");
			return undefined;
		}

		this.modInfoQ = new Query(MsgModInfo.header(MsgMode.REQ, nid), this.onModuleInfoChange);
		this.modInfoQ.log = ((msg) => {
			this.mx10.log.next(msg);
		});
		this.modInfoQ.tx = ((header) => {
			const msg = new MsgModInfo(header, type);
			this.mx10.log.next('mx10 query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.modInfoQ.match = ((msg) => {
			this.mx10.log.next('mx10 query rx: ' + JSON.stringify(msg));
			return (msg.type() === type);
		})
		// this.modInfoQ.subscribe();
		const rv = await this.modInfoQ.run();
		this.mx10.log.next("mx10.getModuleInfo.rv: " + JSON.stringify(rv));
		this.modInfoQ.unlock();
		this.modInfoQ = undefined;
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
				// eslint-disable-next-line no-console
				console.log('command not parsed: ' + command.toString());
		}
	}

	private parseModuleInfo(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if (this.onModuleInfoChange.observed) {
			const NID = buffer.readUInt16LE(0);
			const type = buffer.readUInt16LE(2);
			const info = buffer.readUInt32LE(4);
			const msg = new MsgModInfo(MsgModInfo.header(mode, NID), type, [{value: info, length: 4}]);
			// this.mx10.log.next('onModuleInfoChange <- ' + JSON.stringify(msg));
			this.onModuleInfoChange.next(msg);
		}
	}

	private parseBidiInfo(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onBidiInfoChange.observed)
			return;

		const NID = buffer.readUInt16LE(0);
		const type = buffer.readUInt16LE(2);
		const info = buffer.readUInt32LE(4);

		let data: BidiDirectionData | number = {};
		switch (type) {
			case BidiType.DIRECTION:
				data.direction = this.parseEastWest(info);
				data.directionChange = this.parseDirChange(info);
				data.directionConfirm = this.parseDirectionConfirm(info);
				data.forwardOrReverse = this.parseFwdRev(info);
				break;
			default:
				data = info;
		}

		this.onBidiInfoChange.next({nid: NID, type, data,});
	}

	private parseEastWest(data: number)
	{
		if ((data & 0x02) == 0x02)
			return Direction.EAST;
		return Direction.WEST;
	}

	private parseDirChange(data: number)
	{
		return (data & 0x04) == 0x04;
	}

	private parseFwdRev(data: number)
	{
		if ((data & 0x01) == 0)
			return ForwardOrReverse.REVERSE;
		return ForwardOrReverse.FORWARD;
	}
	private parseDirectionConfirm(data: number)
	{
		return (data & 0x08) == 0x08;
	}
}

// 0x07
import MX10 from '../MX10';
import {Buffer} from 'buffer';
import {Subject} from 'rxjs';
import {RemoveLocomotiveData, DataNameExtended, DataNameValue1,
	ItemFxMode, ItemFxConfig, ItemImageData, ItemListByIndexData, ItemListByNidData} from '../common/models';
import {FxConfigType, FxModeType, ImageType, MsgMode, NameType} from '../common/enums';
import ExtendedASCII from '../common/extendedAscii';
import { MsgGroupCount } from './dataMsg';
import { Query } from '../docs_entrypoint';

/**
 *
 * @category Groups
 */
export default class DataGroup
{
	public readonly onGroupCount = new Subject<MsgGroupCount>();
	public readonly onListItemsByIndex = new Subject<ItemListByIndexData>();
	public readonly onListItemsByNID = new Subject<ItemListByNidData>();
	public readonly onRemoveLocomotive = new Subject<RemoveLocomotiveData>();
	public readonly onItemImageConfig = new Subject<ItemImageData>();
	public readonly onItemFxMode = new Subject<ItemFxMode>();
	public readonly onItemFxConfig = new Subject<ItemFxConfig>();
	public readonly onDataNameExtended = new Subject<DataNameExtended>();

	private groupCountQ: Query<MsgGroupCount> | undefined = undefined;

	private mx10: MX10;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	async groupCount(groupNid = 0): Promise<MsgGroupCount | undefined>
	{
		if(this.groupCountQ !== undefined && !await this.groupCountQ.lock()) {
			this.mx10.log.next("mx10.groupCount: failed to acquire lock");
			return undefined;
		}
		this.groupCountQ = new Query(MsgGroupCount.header(MsgMode.REQ, this.mx10.mx10NID), this.onGroupCount);
		this.groupCountQ.log = ((msg) => {
			this.mx10.log.next(msg);
		});
		this.groupCountQ.tx = ((header) => {
			const msg = new MsgGroupCount(header, groupNid);
			this.mx10.log.next('groupCount query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg);
		});
		this.groupCountQ.match = ((msg) => {
			this.mx10.log.next('groupCount query rx: ' + JSON.stringify(msg));
			return (msg.group() === groupNid);
		})
		const rv = await this.groupCountQ.run();
		this.mx10.log.next("mx10.groupCount.rv: " + JSON.stringify(rv));
		this.groupCountQ.unlock();
		this.groupCountQ = undefined;
		return rv;
	}

	listItemsByIndex(groupNID: number, index: number)
	{
		this.mx10.sendData(0x07, 0x01, [
			{value: this.mx10.mx10NID, length: 2},
			{value: groupNID, length: 2},
			{value: index, length: 2},
		], 0b00);
	}

	listItemsByNID(searchAfterValue: number)
	{
		this.mx10.sendData(0x07, 0x02, [
			{value: this.mx10.mx10NID, length: 2},
			{value: searchAfterValue, length: 2},
		], 0b00);
	}

	removeLocomotive(toRemove: number, removeFrom = this.mx10.mx10NID)
	{
		this.mx10.sendData(0x07, 0x1f, [
			{value: removeFrom, length: 2},
			{value: toRemove, length: 2},
		]);
	}

	itemImageConfig(nid: number, type: ImageType, imageId: number)
	{
		this.mx10.sendData(0x07, 0x12, [
			{value: nid, length: 2},
			{value: type, length: 2},
			{value: imageId, length: 2},
		]);
	}

	itemFxModes(nid: number, group: number, mode: number[])
	{
		this.mx10.sendData(0x07, 0x14, [
			{value: nid, length: 2},
			{value: group, length: 1},
			{value: 0, length: 1},
			{value: mode[0] | (mode[1]<<2) | (mode[2]<<4) | (mode[3]<<6), length: 1},
			{value: mode[4] | (mode[5]<<2) | (mode[6]<<4) | (mode[7]<<6), length: 1},
			{value: mode[8] | (mode[9]<<2) | (mode[10]<<4) | (mode[11]<<6), length: 1},
			{value: mode[12] | (mode[13]<<2) | (mode[14]<<4) | (mode[15]<<6), length: 1},
		]);
	}

	/**
	 * Send Data Fx Config CMD
	 * @param nid Loco NID
	 * @param fx Function button index
	 * @param type 
	 * @param data
	 */
	itemFxConfig(nid: number, fx: number, type: FxConfigType, data: number)
	{
		this.mx10.sendData(0x07, 0x15, [
			{value: nid, length: 2},
			{value: fx, length: 2},
			{value: type, length: 2},
			{value: data, length: 2},
		]);
	}

	dataNameExtended(NID: number, subID: number, name: string)
	{
		this.mx10.sendData(0x07, 0x21, [
			{value: NID, length: 2},
			{value: subID, length: 2},
			{value: 0, length: 4},
			{value: 0, length: 4},
			{value: name, length: name.length},
			{value: 0, length: 1},
		], 0b01);
	}

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command)
		{
			case 0x00:
				this.mx10.log.next('parseGroupCount: ' + JSON.stringify(buffer));
				this.parseGroupCount(size, mode, nid, buffer);
				break;
			case 0x01:
				this.mx10.log.next('parseItemListByIndex: ' + JSON.stringify(buffer));
				this.parseItemListByIndex(size, mode, nid, buffer);
				break;
			case 0x02:
				this.mx10.log.next('parseItemListByNid: ' + JSON.stringify(buffer));
				this.parseItemListByNid(size, mode, nid, buffer);
				break;
			case 0x12:
				this.parseItemImageConfig(size, mode, nid, buffer);
				break;
			case 0x14:
				this.parseItemFxMode(size, mode, nid, buffer);
				break;
			case 0x15:
				this.parseItemFxConfig(size, mode, nid, buffer);
				break;
			case 0x1f:
				this.parseDataClear(size, mode, nid, buffer);
				break;
			case 0x21:
				this.parseDataNameExtended(size, mode, nid, buffer);
				break;
			default:
				this.mx10.log.next('command not parsed: ' + command.toString());
		}
	}

	// 0x07.0x00
	private parseGroupCount(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onGroupCount.observed)
			return;
		const group = buffer.readUInt16LE(0);
		const count = buffer.readUInt16LE(2);
		this.onGroupCount.next(new MsgGroupCount(MsgGroupCount.header(mode, nid), group, count));
	}

	// 0x07.0x01
	private parseItemListByIndex(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onListItemsByIndex.observed)
			return;
		const index = buffer.readUInt16LE(0);
		const deviceNID = buffer.readUInt16LE(2);
		const msSinceLastCommunication = buffer.readUInt16LE(4);
		if(deviceNID)
			this.onListItemsByIndex.next({index, nid: deviceNID, msSinceLastCommunication});
	}

	// 0x07.0x02
	private parseItemListByNid(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onListItemsByNID.observed)
			return;
		const NID = buffer.readUInt16LE(0);
		const index = buffer.readUInt16LE(2);
		const itemState = buffer.readUInt16LE(4);
		const lastTick = buffer.readUInt16LE(6);
		this.onListItemsByNID.next({nid: NID, index, itemState, lastTick});
	}

	// 0x07.0x04
	private parseDataClear(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onRemoveLocomotive.observed)
			return;
		const NID = buffer.readUInt16LE(0);
		const state = buffer.readUInt16LE(2);
		this.onRemoveLocomotive.next({nid: NID, state: state});
	}

	// 0x07.0x12
	private parseItemImageConfig(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onItemImageConfig.observed)
			return;
		const NID = buffer.readUInt16LE(0);
		const type = buffer.readUInt16LE(2);
		const imageId = buffer.readUInt16LE(4);
		this.onItemImageConfig.next({nid: NID, type, imageId});
	}

	// 0x07.0x14
	private parseItemFxMode(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onItemFxMode.observed)
			return;
		const NID = buffer.readUInt16LE(0);
		const group = buffer.readUInt8(2);
		const fxModes = buffer.readUInt32LE(4);
		const fxMode: FxModeType[] = [];
		for(let i=0; i<32; i+=2)
			fxMode.push((fxModes>>i)&0b11);
		const msg: ItemFxMode = {nid: NID, group, mode: fxMode};
		this.mx10.log.next('parseItemFxMode: ' + JSON.stringify(msg));
		this.onItemFxMode.next(msg);
	}

	// setItemFxMode(nid: number, fxId: number, mode: FxModeType)
	// {
	//   if(!this.fxModeRequest?.lock())
	//     return;

	//   const group = fxId/16;
	//   this.fxModeRequest = new Query({group: 0x08, cmd: 0x08, mode: MsgMode.REQ, nid}, this.onItemFxMode);
	//   this.fxModeRequest.tx = ((header) => {
	//     const msg = new ItemFxMode(header, group);
	//     this.mx10.sendMsg(msg);
	//   });
	//   this.fxModeRequest.match = ((msg) => {
	//     return (msg.group() === group);
	//   })
	//   const msg = this.fxModeRequest.run();
	//   if(msg === undefined)
	//     return;
	//   msg.setMode(fxId%16, mode);
	//   msg.header.mode = MsgMode.REQ;
	//   this.mx10.sendMsg(msg);
	//   this.fxModeRequest = undefined;
	// }

	// 0x07.0x15
	private parseItemFxConfig(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onItemFxConfig.observed)
			return;
		const NID = buffer.readUInt16LE(0);
		const fx = buffer.readUInt16LE(2);
		const item = buffer.readUInt16LE(4);
		const data = buffer.readUInt16LE(6);
		const msg: ItemFxConfig = {nid: NID, function: fx, item, data};
		this.mx10.log.next('parseItemFxConfig: ' + JSON.stringify(msg));
		this.onItemFxConfig.next(msg);
	}

	// 0x07.0x21
	private parseDataNameExtended(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onDataNameExtended.observed)
			return;
		
		const NID = buffer.readUInt16LE(0);
		const subID = buffer.readUInt16LE(2);
		const name = ExtendedASCII.byte2str(buffer.subarray(12, 203));
		let value1: DataNameValue1 | undefined;
		const value2 = buffer.readUInt32LE(8);
		let type: NameType;

		switch (NID)
		{
			case 0x7f00:
				type = NameType.MANUFACTURER;
				break;
			case 0x7f02:
				type = NameType.DECODER;
				break;
			case 0x7f04:
				type = NameType.DESIGNATION;
				value1 = {type: buffer.subarray(4).toString('ascii').trim(),
					cfgNum: parseInt(buffer.subarray(5, 7).toString('ascii'))};
				break;
			case 0x7f06:
				type = NameType.CFGDB;
				break;
			case 0x7f10:
				type = NameType.ICON;
				break;
			case 0x7f11:
				type = NameType.ICON;
				break;
			case 0x7f18:
				type = NameType.ZIMO_PARTNER;
				break;
			case 0x7f20:
				type = NameType.LAND;
				break;
			case 0x7f21:
				type = NameType.COMPANY_CV;
				break;
			case 0xc2:
				type = NameType.CONNECTION;
				break;
			default:
				if (subID == 1)
					type = NameType.COMPANY_CV;
				else if (subID == 0)
					type = NameType.VEHICLE;
				else
					type = NameType.CONNECTION;
		}
		this.onDataNameExtended.next({nid: NID, type, subID, value1, value2, name});
	}
}

// 0x07
import MX10 from '../MX10'
import { Buffer } from 'buffer'
import { Subject } from 'rxjs'
import {
  DataClearData,
  DataNameExtended, DataNameValue1,
  GroupCountData,
  ItemListByIndexData,
  ItemListByNidData,
} from '../@types/models'
import { NameType } from '../util/enums'

/**
 *
 * @category Groups
 */
export default class DataGroup {
  public readonly onGroupCount = new Subject<GroupCountData>()
  public readonly onListItemsByIndex = new Subject<ItemListByIndexData>()
  public readonly onListItemsByNID = new Subject<ItemListByNidData>()
  public readonly onDataClear = new Subject<DataClearData>()
  public readonly onDataNameExtended = new Subject<DataNameExtended>()

  private mx10: MX10

  constructor(mx10: MX10) {
    this.mx10 = mx10
  }

  groupCount(objType = 0x0000) {
    this.mx10.sendData(
      0x07,
      0x00,
      [
        { value: this.mx10.mx10NID, length: 2 },
        { value: objType, length: 2 },
      ],
      0b00,
    )
  }

  listItemsByIndex(groupNID: number, index: number) {
    this.mx10.sendData(
      0x07,
      0x01,
      [
        { value: this.mx10.mx10NID, length: 2 },
        { value: groupNID, length: 2 },
        { value: index, length: 2 },
      ],
      0b00,
    )
  }

  listItemsByNID(searchAfterValue: number) {
    this.mx10.sendData(
      0x07,
      0x02,
      [
        { value: this.mx10.mx10NID, length: 2 },
        { value: searchAfterValue, length: 2 },
      ],
      0b00,
    )
  }

  dataClear(nidToRemove: number, removeFromNID = this.mx10.mx10NID) {
    this.mx10.sendData(0x07, 0x04, [
      { value: removeFromNID, length: 2 },
      { value: nidToRemove, length: 2 },
    ])
  }

  dataNameExtended(NID: number, subID: number, name: string) {
    this.mx10.sendData(
      0x07,
      0x21,
      [
        { value: NID, length: 2 },
        { value: subID, length: 2 },
        { value: 0, length: 4 },
        { value: 0, length: 4 },
        { value: name, length: name.length},
        { value: 0, length: 1 },
      ],
      0b01,
    )
  }

  _parse(size: number, command: number, mode: number, nid: number, buffer: Buffer) {
    switch (command) {
      case 0x00:
        this.parseGroupCount(size, mode, nid, buffer)
        break
      case 0x01:
        this.parseItemListByIndex(size, mode, nid, buffer)
        break
      case 0x02:
        this.parseItemListByNid(size, mode, nid, buffer)
        break
      case 0x04:
        this.parseDataClear(size, mode, nid, buffer)
        break
      case 0x21:
        this.parseDataNameExtended(size, mode, nid, buffer)
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('command not parsed: ' + command.toString())
    }
  }

  // 0x07.0x00
  private parseGroupCount(_size: number, _mode: number, _nid: number, buffer: Buffer) {
    const objectType = buffer.readUInt16LE(0)
    const number = buffer.readUInt16LE(2)

    this.onGroupCount.next({
      objectType,
      number,
    })
  }

  // 0x07.0x01
  private parseItemListByIndex(_size: number, _mode: number, _nid: number, buffer: Buffer) {
    const index = buffer.readUInt16LE(0)
    const deviceNID = buffer.readUInt16LE(2)
    const msSinceLastCommunication = buffer.readUInt16LE(4)

    this.onListItemsByIndex.next({
      index,
      nid: deviceNID,
      msSinceLastCommunication,
    })
  }

  // 0x07.0x02
  private parseItemListByNid(_size: number, _mode: number, _nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0)
    const index = buffer.readUInt16LE(2)
    const itemState = buffer.readUInt16LE(4)
    const lastTick = buffer.readUInt16LE(6)

    this.onListItemsByNID.next({
      nid: NID,
      index,
      itemState,
      lastTick,
    })
  }

  // 0x07.0x04
  private parseDataClear(_size: number, _mode: number, _nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0)
    const state = buffer.readUInt16LE(2)

    this.onDataClear.next({
      nid: NID,
      state: state,
    })
  }

  // 0x07.0x21
  private parseDataNameExtended(_size: number, _mode: number, _nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0)
    const subID = buffer.readUInt16LE(2)
    const name = buffer.subarray(12, 203).toString('ascii').replace(/\x00/, '');

    let value1: DataNameValue1 | undefined;
    const value2 = buffer.readUInt32LE(8);
    let type: NameType;

    switch (NID) {
      case 0x7f00:
        type = NameType.MANUFACTURER;
        break
      case 0x7f02:
        type = NameType.DECODER;
        break
      case 0x7f04:
        type = NameType.DESIGNATION;
        value1 = {
          type: buffer.subarray(4).toString('ascii').trim(),
          cfgNum: parseInt(buffer.subarray(5, 7).toString('ascii')),
        }
        break
      case 0x7f06:
        type = NameType.CFGDB;
        break
      case 0x7f10:
        type = NameType.ICON;
        break
      case 0x7f11:
        type = NameType.ICON;
        break
      case 0x7f18:
        type = NameType.ZIMO_PARTNER;
        break
      case 0x7f20:
        type = NameType.LAND;
        break
      case 0x7f21:
        type = NameType.COMPANY_CV;
        break
      case 0xC2:
        type = NameType.CONNECTION;
        break;
      default:
        if (subID == 1) {
          type = NameType.COMPANY_CV;
        } else if (subID == 0) {
          type = NameType.VEHICLE;
        } else {
          type = NameType.CONNECTION;
        }
    }

    this.onDataNameExtended.next({
      nid: NID,
      type,
      subID,
      value1,
      value2,
      name,
    })
  }
}

// 0x07
import MX10 from '../MX10';
import {Buffer} from 'buffer';
import {Subject} from "rxjs";
import {GroupCountData, ItemListByIndexData, ItemListByNidData} from "../@types/models";

export default class DataGroup {

  public readonly onGroupCount = new Subject<GroupCountData>();
  public readonly onListItemsByIndex = new Subject<ItemListByIndexData>();
  public readonly onListItemsByNID = new Subject<ItemListByNidData>();

  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  groupCount(objType = 0x0000) {
    this.mx10.sendData(
      0x07,
      0x00,
      [
        {value: this.mx10.mx10NID, length: 2},
        {value: objType, length: 2},
      ],
      0b00,
    );
  }

  listItemsByIndex(groupNID: number, index: number) {
    this.mx10.sendData(
      0x07,
      0x01,
      [
        {value: this.mx10.mx10NID, length: 2},
        {value: groupNID, length: 2},
        {value: index, length: 2},
      ],
      0b00,
    );
  }

  listItemsByNID(searchAfterValue: number) {
    this.mx10.sendData(
      0x07,
      0x02,
      [
        {value: this.mx10.mx10NID, length: 2},
        {value: searchAfterValue, length: 2},
      ],
      0b00,
    );
  }

  _parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x00:
        this.parseGroupCount(size, mode, nid, buffer);
        break;
      case 0x01:
        this.parseItemListByIndex(size, mode, nid, buffer);
        break;
      case 0x02:
        this.parseItemListByNid(size, mode, nid, buffer);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn('command not parsed: ' + command.toString());
    }
  }

  // 0x07.0x00
  private parseGroupCount(
    _size: number,
    _mode: number,
    _nid: number,
    buffer: Buffer,
  ) {
    const objectType = buffer.readUInt16LE(0);
    const number = buffer.readUInt16LE(2);

    this.onGroupCount.next({
      objectType,
      number,
    })
  }

  // 0x07.0x01
  private parseItemListByIndex(
    _size: number,
    _mode: number,
    _nid: number,
    buffer: Buffer,
  ) {
    const index = buffer.readUInt16LE(0);
    const deviceNID = buffer.readUInt16LE(2);
    const msSinceLastCommunication = buffer.readUInt16LE(4);


    this.onListItemsByIndex.next({
      index,
      nid: deviceNID,
      msSinceLastCommunication,
    })
  }

  // 0x07.0x02
  private parseItemListByNid(
    _size: number,
    _mode: number,
    _nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const index = buffer.readUInt16LE(2);
    const itemState = buffer.readUInt16LE(4);
    const lastTick = buffer.readUInt16LE(6);


    this.onListItemsByNID.next({
      nid: NID,
      index,
      itemState,
      lastTick,
    })
  }

}

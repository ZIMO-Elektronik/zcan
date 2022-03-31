import {Buffer} from 'buffer';
import MX10 from '../MX10';
import {Subject} from "rxjs";
import {BidiInfoData} from "../@types/models";

export default class InfoGroup {
  private mx10: MX10;

  public readonly onBidiInfoChange = new Subject<BidiInfoData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  _parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {

      case 0x05:
        this.parseBidiInfo(size, mode, nid, buffer);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('command not parsed: ' + command.toString());
    }
  }

  private parseBidiInfo(size: number, mode: number, nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0);
    const type = buffer.readUInt16LE(2);
    const data = buffer.readUInt32LE(4);

    this.onBidiInfoChange.next({
      nid: NID,
      type,
      data,
    })
  }
}

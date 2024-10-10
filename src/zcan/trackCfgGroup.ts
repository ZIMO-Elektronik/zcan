import {
  TseInfoExtended,
  TseProgReadExtended,
  TseProgWriteExtended,
} from 'src/@types/models';
import MX10 from '../MX10';
import {Subject} from 'rxjs';

/**
 *
 * @category Groups
 */
export default class TrackCfgGroup {
  public readonly onTseInfoExtended = new Subject<TseInfoExtended>();
  public readonly onTseProgReadExtended = new Subject<TseProgReadExtended>();
  public readonly onTseProgWriteExtended = new Subject<TseProgWriteExtended>();

  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  tseProgRead(NID: number, CV: number) {
    this.mx10.sendData(0x16, 0x08, [
      {value: this.mx10.mx10NID, length: 2},
      {value: NID, length: 2},
      {value: CV, length: 4},
    ]);
  }

  tseProgWrite(NID: number, CV: number, value: number) {
    this.mx10.sendData(0x16, 0x09, [
      {value: this.mx10.mx10NID, length: 2},
      {value: NID, length: 2},
      {value: CV, length: 4},
      {value: value, length: 1},
    ]);
  }

  parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x02:
        this.parseTseInfo(size, mode, nid, buffer);
        break;
      case 0x08:
        this.parseTseProgRead(size, mode, nid, buffer);
        break;
      case 0x09:
        this.parseTseProgWrite(size, mode, nid, buffer);
        break;
    }
  }

  // 0x16.0x02
  parseTseInfo(size: number, mode: number, nid: number, buffer: Buffer) {
    if (this.onTseInfoExtended.observed) {
      // const sysNid = buffer.readUInt16LE(0);
      const NID = buffer.readUInt16LE(2);
      const cfgNum = buffer.readUInt32LE(4);
      const cvState = buffer.readUint8(8);
      const cvCode = buffer.readUint8(9);

      this.onTseInfoExtended.next({
        nid: NID,
        cfgNum,
        cvState,
        cvCode,
      });
    }
  }

  // 0x16.0x08
  parseTseProgRead(size: number, mode: number, nid: number, buffer: Buffer) {
    if (this.onTseProgReadExtended.observed) {
      // const sysNid = buffer.readUInt16LE(0);
      const NID = buffer.readUInt16LE(2);
      const cfgNum = buffer.readUInt32LE(4);
      const cvValue = buffer.readUInt16LE(8);

      this.onTseProgReadExtended.next({
        nid: NID,
        cfgNum,
        cvValue,
      });
    }
  }

  // 0x16.0x09
  parseTseProgWrite(size: number, mode: number, nid: number, buffer: Buffer) {
    if (this.onTseProgWriteExtended.observed) {
      const NID = buffer.readUInt16LE(0);
      const cfgNum = buffer.readUInt32LE(2);
      const cvValue = buffer.readUint8(6);

      this.onTseProgWriteExtended.next({
        nid: NID,
        cfgNum,
        cvValue,
      });
    }
  }
}

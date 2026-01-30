import {
  MsgCvRead,
  TseInfoExtended,
  TseProgWriteExtended,
} from '../@types/models';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {Query} from '../docs_entrypoint';
import {MsgMode} from '../util/enums';

/**
 *
 * @category Groups
 */
export default class TrackCfgGroup {
  public readonly onTseInfoExtended = new Subject<TseInfoExtended>();
  public readonly onTseProgReadExtended = new Subject<MsgCvRead>();
  public readonly onTseProgWriteExtended = new Subject<TseProgWriteExtended>();
  public readonly onTseProgWrite16Extended = new Subject<TseProgWriteExtended>();

  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  private getCvQ: Query<MsgCvRead> | undefined = undefined;

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

  tseProgWrite16(NID: number, CV: number, value: number) {
    this.mx10.sendData(0x16, 0x0d, [
      {value: this.mx10.mx10NID, length: 2},
      {value: NID, length: 2},
      {value: CV, length: 2},
      {value: value, length: 2},
    ]);
  }

  async getCv(nid: number, cvNum: number): Promise<MsgCvRead | undefined>
  {
    if(this.getCvQ !== undefined && !await this.getCvQ.lock()) {
      this.mx10.log.next("mx10.getCv: failed to acquire lock");
      return undefined;
    }

    this.getCvQ = new Query(MsgCvRead.header(MsgMode.REQ, nid), this.onTseProgReadExtended);
    this.getCvQ.log = ((msg) => {
      this.mx10.log.next(msg);
    });
    this.getCvQ.tx = ((header) => {
      const msg = new MsgCvRead(header, cvNum);
      // this.mx10.log.next('mx10 query tx: ' + JSON.stringify(msg));
      this.mx10.sendMsg(msg);
    });
    this.getCvQ.match = ((msg) => {
      // this.mx10.log.next('mx10 query rx: ' + JSON.stringify(msg));
      return (msg.number() === cvNum);
    })
    const rv = await this.getCvQ.run();
    // this.mx10.log.next("mx10.getCv.rv: " + JSON.stringify(rv));
    this.getCvQ.unlock();
    this.getCvQ = undefined;
    return rv;
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
      case 0x0d:
          this.parseTseProgWrite16(size, mode, nid, buffer);
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

      this.onTseProgReadExtended.next(
        new MsgCvRead(MsgCvRead.header(mode, nid), cfgNum, cvValue)
      );
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

    // 0x16.0x0d
    parseTseProgWrite16(size: number, mode: number, nid: number, buffer: Buffer) {
      if (this.onTseProgWrite16Extended.observed) {

        if(buffer.length < 6)
          throw new Error('parseTseProgWrite16 rx: ' + buffer);

        const NID = buffer.readUInt16LE(0);
        const cfgNum = buffer.readUint16LE(2);
        const cvValue = buffer.readUint16LE(4);

        this.onTseProgWrite16Extended.next({
          nid: NID,
          cfgNum,
          cvValue,
        });
      }
    }
}

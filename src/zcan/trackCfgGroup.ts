import MX10 from '../MX10';

/**
 *
 * @category Groups
 */
export default class TrackCfgGroup {
  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  tseProgRead(trainAddress: number, CV: number) {
    this.mx10.sendData(0x16, 0x08, [
      {value: trainAddress, length: 2},
      {value: CV, length: 4},
    ]);
  }

  tseProgWrite(trainAddress: number, CV: number, value: number) {
    this.mx10.sendData(0x16, 0x09, [
      {value: trainAddress, length: 2},
      {value: CV, length: 4},
      {value: value, length: 1},
    ]);
  }

  _parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x08:
        this.parseTseProgRead(size, mode, nid, buffer);
        break;
      case 0x09:
        this.parseTseProgWrite(size, mode, nid, buffer);
        break;
    }
  }

  // 0x16.0x08
  parseTseProgRead(size: number, mode: number, nid: number, buffer: Buffer) {
    const SysNid = buffer.readUInt16LE(0);
    const FahrzeugNID = buffer.readUInt16LE(2);
    const cfgNum = buffer.readUInt32LE(4);
    const valCV = buffer.readUInt16LE(8);

    return {
      SysNid,
      FahrzeugNID,
      cfgNum,
      valCV,
    }
  }

  // 0x16.0x09
  parseTseProgWrite(size: number, mode: number, nid: number, buffer: Buffer) {
    const SysNId = buffer.readUInt16LE(0);
    const FahrzeugNID = buffer.readUInt16LE(2);
    const cfgNum = buffer.readUInt32LE(4);
    const valCV = buffer.readUint8(8);

    return {
      SysNId,
      FahrzeugNID,
      cfgNum,
      valCV
    }
  }
}

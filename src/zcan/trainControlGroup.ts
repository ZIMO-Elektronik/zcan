/* eslint-disable @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';

export default class TrainControlGroup {
  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  trainPartFind(NID: number) {
    //Check if loco is in a traction
    this.mx10.sendData(0x05, 0x02, [{value: NID, length: 2}], 0b00);
  }

  _parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x02:
        this.parseTrainPartFind(size, mode, nid, buffer);
        break;
    }
  }

  // 0x05.0x02
  parseTrainPartFind(size: number, mode: number, nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0);
    const trainNID = buffer.readUInt16LE(2);
    const ownerNID = buffer.readUInt16LE(4);
    const state = buffer.readUInt16LE(6);

    return {
      NID,
      trainNID,
      ownerNID,
      state
    }
  }
}

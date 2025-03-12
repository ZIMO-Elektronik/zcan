/* eslint-disable  @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {LocoStateData} from '../@types/models';
import ExtendedASCII from '../util/extended-ascii';

/**
 *
 * @category Groups
 */
export default class LanLocoStateGroup {
  private mx10: MX10;

  public readonly onLocoStateExtended = new Subject<LocoStateData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x00:
        this.parseLocoStateExtended(size, mode, nid, buffer);
        break;
    }
  }

  // 0x12.0x00
  private parseLocoStateExtended(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onLocoStateExtended.observed) {
      const NID = buffer.readUInt16LE(0);
      const type = buffer.readUInt16LE(2);
      const ownerNid = buffer.readUInt16LE(4);
      const trainNid = buffer.readUInt16LE(6);
      const lastControlledTime = buffer.readUInt32LE(8);
      const railComData = buffer.readUInt32LE(12);

      const partOneFunctions = buffer.readUInt32LE(16);
      const partTwoFunctions = buffer.readUInt32LE(20);
      let functions = partTwoFunctions * 2 ** 32 + partOneFunctions;

      const functionsStates = [];
      for (let i = 0; i < 63; i++) {
        const active = (functions & 1) === 1;
        functions >>>= 1;
        functionsStates.push(active);
      }

      const sentDCCData = buffer.readUInt32LE(24);
      const receivedRailcomData = buffer.readUInt32LE(28);

      this.onLocoStateExtended.next({
        nid: NID,
        type,
        ownerNid,
        // trainNid is if its part of Loco
        trainNid,
        lastControlledTime,
        railComData,
        functionsStates,
        sentDCCData,
        receivedRailcomData,
      });
    }
  }
}

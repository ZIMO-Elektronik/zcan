/* eslint-disable @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {SystemStateMode} from "../util/enums";
import {Buffer} from "buffer";
import {Subject} from "rxjs";
import {SystemStateData} from "../@types/models";

/**
 *
 * @category Groups
 */
export default class SystemControlGroup {
  private mx10: MX10;

  public readonly onSystemStateChange = new Subject<SystemStateData>()

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  //0x00.0x00
  systemState(mode: SystemStateMode, port=0xff, device = this.mx10.mx10NID) {

    this.mx10.sendData(0x00, 0x00, [
      {value: device, length: 2},
      {value: port, length: 1},
      {value: mode, length: 1},
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
      case 0x00:
        this.parseSystemState(size, mode, nid, buffer);
        break;
    }
  }

  private parseSystemState(size:number, mode: number, nid:number, buffer: Buffer) {
    const deviceNID = buffer.readUInt16LE(0);
    const port = buffer.readUInt8(2);
    const modeState = buffer.readUInt8(3);

    this.onSystemStateChange.next({
      nid: deviceNID,
      port,
      mode: modeState
    })
  }
}

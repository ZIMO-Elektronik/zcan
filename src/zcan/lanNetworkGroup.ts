/* eslint-disable @typescript-eslint/no-unused-vars */

// 0x1A
import MX10 from '../MX10';
import {Subject} from "rxjs";

/**
 *
 * @category Groups
 */
export default class LanNetworkGroup {
  private mx10: MX10;

  public readonly onPortOpen = new Subject<boolean>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  portOpen() {
    this.mx10.sendData(0x1a, 0x06, [
      {value: 1, length: 4},
      {value: 214748364, length: 4},
      {value: 'ZIMO APP', length: 20}
    ], 0b01, this.mx10.myNID, true);
  }

  // Responses
  _parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x06:
        this.parsePortOpen(size, mode, nid, buffer);
        break;
      case 0x0e:
        this._parseUnknownCommand(size, mode, nid, buffer);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn('command not parsed: ' + command.toString());
    }
  }

  parsePortOpen(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    this.mx10.mx10NID = nid;
    this.mx10.connected = true;

    this.onPortOpen.next(true);
  }

  // 0x1A.0x0e
  _parseUnknownCommand(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    // TODO implement once documented
    // console.debug('IMPLEMENT 0x1A.0x0e', size, mode, nid, buffer);
  }
}

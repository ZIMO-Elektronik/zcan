/* eslint-disable @typescript-eslint/no-unused-vars */
import {Subject} from 'rxjs';
import MX10 from '../MX10';
import {AccessoryModeData, AccessoryPortData} from '../@types/models';
import {AccessoryMode} from '../util/enums';

/**
 *
 * @category Groups
 */
export default class AccessoryCommandGroup {
  public readonly onAccessoryMode = new Subject<AccessoryModeData>();
  public readonly onAccessoryPort = new Subject<AccessoryPortData>();

  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  accessoryModeByNid(nid: number) {
    this.mx10.sendData(0x01, 0x01, [{value: nid, length: 2}], 0b00);
  }

  accessoryPortByNid(nid: number) {
    this.mx10.sendData(
      0x01,
      0x02,
      [
        {value: nid, length: 2},
        {value: 0, length: 2},
      ],
      0b00,
    );
  }

  parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x01:
        this.parseAccessoryMode(size, mode, nid, buffer);
        break;
      case 0x02:
        this.parseAccessoryPort(size, mode, nid, buffer);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn('command not parsed: ' + command.toString());
    }
  }

  parseAccessoryMode(size: number, mode: number, nid: number, buffer: Buffer) {
    if (this.onAccessoryMode.observed) {
      const deviceNID = buffer.readUInt16LE(0);
      const mode = buffer.readUInt16LE(2);

      let parsedMode: AccessoryMode;
      switch (mode) {
        case 1:
          parsedMode = AccessoryMode.PAIRED;
          break;
        case 2:
          parsedMode = AccessoryMode.SINGLE;
          break;
        default:
          parsedMode = AccessoryMode.UNKNOWN;
      }

      if (deviceNID) {
        this.onAccessoryMode.next({
          nid: deviceNID,
          mode: parsedMode,
        });
      }
    }
  }

  parseAccessoryPort(size: number, mode: number, nid: number, buffer: Buffer) {
    if (this.onAccessoryPort.observed) {
      const deviceNID = buffer.readUInt16LE(0);
      const type = buffer.readUInt16LE(2);
      const port = buffer.readUInt32LE(4);

      if (deviceNID) {
        this.onAccessoryPort.next({
          nid: deviceNID,
          mode,
          port,
        });
      }
    }
  }
}

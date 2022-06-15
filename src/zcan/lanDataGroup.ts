// 0x17
import MX10 from "../MX10";
import { FunctionMode, getOperatingMode, OperatingMode } from "../util/enums";
import { DataValueExtendedData, Train, TrainFunction } from "../@types/models";
import {Subject} from "rxjs";
import { parseSpeed } from "../internal/speedUtils";

/**
 *
 * @category Groups
 */
export default class LanDataGroup {
  public readonly onLocoGuiExtended = new Subject<Train>();
  public readonly onDataValueExtended = new Subject<DataValueExtendedData>();

  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  locoGuiExtended(NID: number) {
    this.mx10.sendData(
      0x17,
      0x27,
      [
        {value: this.mx10.mx10NID, length: 2},
        {value: NID, length: 2},
        {value: 0, length: 2},
      ],
      0b00,
    );
  }

  dataValueExtended(NID: number) {
    this.mx10.sendData(
      0x17,
      0x08,
      [
        {value: this.mx10.mx10NID, length: 2},
        {value: NID, length: 2},
        {value: 0, length: 2},
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
      case 0x08:
        this._parseDataValueExtended(size, mode, nid, buffer);
        break;
      case 0x27:
        this._parseLocoGuiExtended(size, mode, nid, buffer);
        break;
    }
  }

  // 0x17.0x08
  private _parseDataValueExtended(
    _size: number,
    _mode: number,
    _nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const subId = buffer.readUInt16LE(2);
    const offset = subId == 0 ? 0 : 10;

      const trackMode = buffer.readUInt8(16 + offset);
    const functionCount = buffer.readUInt8(17 + offset);
      const speedAndDirection = buffer.readUInt16LE(36 + offset);

      const {speedStep, forward, eastWest, emergencyStop} = parseSpeed(speedAndDirection);
      const operatingMode = getOperatingMode(trackMode);

      // train?.setConsist(consist); // TODO set once it is part of data

      let functions = buffer.readUInt32LE(38 + offset);
      const functionsStates = [];
      for (let i = 0; i < 31; i++) {
        const active = (functions & 1) == 1;
        functionsStates.push(active);
        functions = functions >> 1;
      }

      this.onDataValueExtended.next({
        nid: NID,
        functionCount,
        speedStep,
        forward,
        eastWest,
        emergencyStop,
        operatingMode,
        functionsStates
      })
  }

  // 0x17.0x27
  private _parseLocoGuiExtended(
    _size: number,
    _mode: number,
    _nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const SubID = buffer.readUInt16LE(2);
    const vehicleGroup = buffer.readUInt16LE(4);

    const name = buffer.subarray(6, 32).toString('ascii');
    const imageId = buffer.readUInt16LE(38);
    const tacho = buffer.readUInt16LE(40);
    const speedFwd = buffer.readUInt16LE(42);
    const speedRev = buffer.readUInt16LE(44);
    const speedRange = buffer.readUInt16LE(46);
    const driveType = buffer.readUInt16LE(48);
    const era = buffer.readUInt16LE(50);
    const countryCode = buffer.readUInt16LE(52);

    // reading 64 bytes of functions
    const functions = Array<TrainFunction>();
    for (let i = 0; i < 33; i++) {
      const icon = buffer.readUInt16LE(54 + i*2)
      functions.push(
        {
          mode: FunctionMode.switch,
          active: false,
          icon: String(icon).padStart(4, '0'),
        },
      );
    }

    this.onLocoGuiExtended.next({
      nid: NID,
      subId: SubID,
      name: name,
      group: vehicleGroup,
      image: imageId == 0 ? undefined : imageId.toString(),
      tacho: tacho.toString(),
      speedFwd: speedFwd,
      speedRev: speedRev,
      speedRange: speedRange,
      operatingMode: OperatingMode.UNKNOWN,
      driveType: driveType,
      era: this.parseEra(era),
      countryCode: countryCode,
      functions,
    })
  }

  private parseEra(eraString: number) {
    let result = '';
    switch (eraString & 0xF0) {
      case 0x10:
        result += 'I';
        break;
      case 0x20:
        result += 'I';
        result += 'I';
        break;
      case 0x30:
        result += 'I';
        result += 'I';
        result += 'I';
        break;
      case 0x40:
        result += 'I';
        result += 'V';
        break;
      case 0x50:
        result += 'V';
        break;
      case 0x60:
        result += 'V';
        result += 'I';
        break;
      case 0x70:
        result += 'V';
        result += 'I';
        result += 'I';
        break;
    }

    return result;
  }
}

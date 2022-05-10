// 0x17
import MX10 from '../MX10';
import {FunctionMode, getOperatingMode, OperatingMode} from "../util/enums";
import {DataValueExtendedData, Train, TrainFunction} from "../@types/models";
import { Subject} from "rxjs";
import {parseSpeed} from "../internal/speedUtils";

const functionsCount = 31;

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
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    // const SubID = buffer.readUInt16LE(2);

    const trackMode = buffer.readUInt8(16);
    const speedAndDirection = buffer.readUInt16LE(36);

    const {speedStep, forward, eastWest, emergencyStop} = parseSpeed(speedAndDirection);
    const operatingMode = getOperatingMode(trackMode);



    // train?.setConsist(consist); // TODO set once it is part of data

    const functions = buffer.subarray(38, 41);
    const functionsStates = [];
    for (let i = 0; i < functions.length; i++) {
      const active = Boolean(functions[i]);
      functionsStates.push(active);
    }

    this.onDataValueExtended.next({
      nid: NID,
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
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const SubID = buffer.readUInt16LE(2);
    const vehicleGroup = buffer.readUInt16LE(4);

    const name = buffer.subarray(6, 38).toString('ascii');
    const imageId = buffer.readUInt16LE(39);
    const tacho = buffer.readUInt16LE(45);
    const VMaxFwd = buffer.readUInt16LE(51);
    const VMaxRev = buffer.readUInt16LE(53);
    const vRange = buffer.readUInt16LE(55);
    const driveType = buffer.readUInt16LE(57);
    const era = buffer.readUInt16LE(59); //TODO correctly parse era
    const countryCode = buffer.readUInt16LE(62);

    // reading 64 bytes of functions
    const functionsIconsStart = 63;
    const functionsIconsSize = functionsCount * 2;
    const functionsBuff = buffer.subarray(
      functionsIconsStart,
      functionsIconsStart + functionsIconsSize,
    );
    const functions = Array<TrainFunction>();
    for (let offset = 0; offset < functionsIconsSize; offset += 2) {
      const icon = functionsBuff.toString('ascii', offset, 2);
      functions.push(
        {
          mode: FunctionMode.switch,
          active: false,
          icon: icon.toString(),
        },
      );
    }

    this.onLocoGuiExtended.next({
      nid: NID,
      subId: SubID,
      name: name,
      group: vehicleGroup,
      image: imageId.toString(),
      tacho: tacho.toString(),
      vMaxFWD: VMaxFwd,
      vMaxREV: VMaxRev,
      vRange: vRange,
      operatingMode: OperatingMode.UNKNOWN,
      driveType: driveType,
      era: era.toString(),
      countryCode: countryCode,
      functions,
    })
  }
}

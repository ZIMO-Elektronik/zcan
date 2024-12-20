/* eslint-disable  @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {
  CallFunctionData,
  CallSpecialFunctionData,
  VehicleStateData,
  VehicleModeData,
  VehicleSpeedData,
} from '../@types/models';
import {
  Direction,
  DirectionDefault,
  getOperatingMode,
  Manual,
  ShuntingFunction,
  SpecialFunctionMode,
} from '../util/enums';
import {
  combineSpeedAndDirection,
  getSpeedSteps,
  parseSpeed,
} from '../internal/speedUtils';

/**
 *
 * @category Groups
 */
export default class VehicleGroup {
  private mx10: MX10;

  public readonly onVehicleState = new Subject<VehicleStateData>();
  public readonly onVehicleMode = new Subject<VehicleModeData>();
  public readonly onChangeSpeed = new Subject<VehicleSpeedData>();
  public readonly onCallFunction = new Subject<CallFunctionData>();
  public readonly onCallSpecialFunction =
    new Subject<CallSpecialFunctionData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  vehicleMode(vehicleAddress: number) {
    this.mx10.sendData(0x02, 0x01, [{value: vehicleAddress, length: 2}]);
  }

  changeSpeed(
    vehicleAddress: number,
    speedStep: number,
    forward: boolean,
    eastWest?: Direction,
    emergencyStop?: boolean,
  ) {
    const speedAndDirection = combineSpeedAndDirection(
      speedStep,
      forward,
      eastWest,
      emergencyStop,
    );

    this.mx10.sendData(0x02, 0x02, [
      {value: vehicleAddress, length: 2},
      {value: speedAndDirection, length: 2},
      {value: 0x0000, length: 2},
    ]);
  }

  callFunction(
    vehicleAddress: number,
    functionId: number,
    functionStatus: boolean,
  ) {
    this.mx10.sendData(0x02, 0x04, [
      {value: vehicleAddress, length: 2},
      {value: functionId, length: 2},
      {value: Number(functionStatus), length: 2},
    ]);
  }

  changeSpecialFunction(
    vehicleAddress: number,
    specialFunctionMode: SpecialFunctionMode,
    specialFunctionStatus: Manual | ShuntingFunction | DirectionDefault,
  ) {
    this.mx10.sendData(0x02, 0x05, [
      {value: vehicleAddress, length: 2},
      {value: specialFunctionMode, length: 2},
      {value: specialFunctionStatus, length: 2},
    ]);
  }

  //0x02.0x00
  vehicleState(vehicleAddress: number) {
    return this.mx10.sendData(
      0x02,
      0x00,
      [{value: vehicleAddress, length: 2}],
      0b00,
    );
  }

  // 0x02.0x10
  activeModeTrain(vehicleAddress: number) {
    return this.mx10.sendData(
      0x02,
      0x10,
      [
        {value: vehicleAddress, length: 2},
        {value: 0x01, length: 2},
      ],
      0b01,
    );
  }

  activeModeTakeOver(vehicleAddress: number) {
    return this.mx10.sendData(
      0x02,
      0x10,
      [
        {value: vehicleAddress, length: 2},
        {value: 0x10, length: 2},
      ],
      0b01,
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
      case 0x00:
        this.parseVehicleState(size, mode, nid, buffer);
        break;
      case 0x01:
        this.parseVehicleMode(size, mode, nid, buffer);
        break;
      case 0x02:
        this.parseVehicleSpeed(size, mode, nid, buffer);
        break;
      case 0x04:
        this.parseVehicleFunction(size, mode, nid, buffer);
        break;
      case 0x05:
        this.parseVehicleSpecialFunction(size, mode, nid, buffer);
        break;
    }
  }

  // 0x02.0x00
  private parseVehicleState(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onVehicleState.observed) {
      const NID = buffer.readUInt16LE(0);
      const stateFlags = buffer.readUInt16LE(2); // TODO: add
      const ctrlTick = buffer.readUInt16LE(4);
      const ctrlDevice = buffer.readUInt16LE(6);

      this.onVehicleState.next({
        nid: NID,
        ctrlTick,
        ctrlDevice,
      });
    }
  }

  // 0x02.0x01
  private parseVehicleMode(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onVehicleMode.observed) {
      const NID = buffer.readUInt16LE(0);
      const mode1 = buffer.readUInt8(2);
      const mode2 = buffer.readUInt8(3);
      const mode3 = buffer.readUInt8(4);

      const operatingMode = getOperatingMode(mode1);
      const speedSteps = getSpeedSteps(mode1);

      this.onVehicleMode.next({
        nid: NID,
        speedSteps,
        operatingMode,
        mode2,
        mode3,
      });
    }
  }

  // 0x02.0x02
  private parseVehicleSpeed(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onChangeSpeed.observed) {
      const NID = buffer.readUInt16LE(0);
      const speedAndDirection = buffer.readUInt16LE(2);
      const divisor = buffer.readUint8(4);

      const {speedStep, forward, eastWest, emergencyStop} =
        parseSpeed(speedAndDirection);

      this.onChangeSpeed.next({
        nid: NID,
        divisor,
        speedStep,
        forward,
        eastWest,
        emergencyStop,
      });
    }
  }

  // 0x02.0x04
  private parseVehicleFunction(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onCallFunction.observed) {
      const NID = buffer.readUInt16LE(0);
      const functionNumber = buffer.readUInt16LE(2);
      const functionState = buffer.readUInt16LE(4);

      const functionActive = functionState !== 0x00;

      this.onCallFunction.next({
        nid: NID,
        functionNumber,
        functionState: functionActive,
      });
    }
  }

  // 0x02.0x05
  private parseVehicleSpecialFunction(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onCallSpecialFunction.observed) {
      const NID = buffer.readUInt16LE(0);
      const specialFunctionMode = buffer.readUInt16LE(2);
      const specialFunctionState = buffer.readUInt16LE(4);

      this.onCallSpecialFunction.next({
        nid: NID,
        specialFunctionMode,
        specialFunctionState,
      });
    }
  }
}

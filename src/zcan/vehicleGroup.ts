/* eslint-disable  @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Subject} from "rxjs";
import {CallFunctionData, VehicleModeData, VehicleSpeedData} from "../@types/models";
import {Direction, getOperatingMode} from "../util/enums";
import {combineSpeedAndDirection, getSpeedSteps, parseSpeed} from "../internal/speedUtils";

export default class VehicleGroup {
  private mx10: MX10;

  public readonly onVehicleMode = new Subject<VehicleModeData>();
  public readonly onChangeSpeed = new Subject<VehicleSpeedData>();
  public readonly onCallFunction = new Subject<CallFunctionData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  vehicleMode(
    vehicleAddress: number,
  ) {

    this.mx10.sendData(0x02, 0x01, [
      {value: vehicleAddress, length: 2},
    ]);
  }

  changeSpeed(
    vehicleAddress: number,
    speedStep: number,
    forward: boolean,
    eastWest?: Direction,
    emergencyStop?: boolean
  ) {

    const speedAndDirection = combineSpeedAndDirection(speedStep, forward, eastWest, emergencyStop);

    this.mx10.sendData(0x02, 0x02, [
      {value: vehicleAddress, length: 2},
      {value: speedAndDirection, length: 2},
      {value: 0x0000, length: 2},
    ]);
  }

  callFunction(vehicleAddress: number, functionId: number, functionStatus: boolean) {
    this.mx10.sendData(0x02, 0x04, [
      {value: vehicleAddress, length: 2},
      {value: functionId, length: 2},
      {value: Number(functionStatus), length: 2},
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
      case 0x01:
        this.parseVehicleMode(size, mode, nid, buffer);
        break;
      case 0x02:
        this.parseVehicleSpeed(size, mode, nid, buffer);
        break;
      case 0x04:
        this.parseVehicleFunction(size, mode, nid, buffer);
        break;
    }
  }

  // 0x02.0x01
  private parseVehicleMode(size: number, mode: number, nid: number, buffer: Buffer) {

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
    })

  }

  // 0x02.0x02
  private parseVehicleSpeed(size: number, mode: number, nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0);
    const speedAndDirection = buffer.readUInt16LE(2);
    const divisor = buffer.readUint8(4);

    const {
      speedStep,
      forward,
      eastWest,
      emergencyStop
    } = parseSpeed(speedAndDirection);

    this.onChangeSpeed.next({
      nid: NID,
      divisor,
      speedStep,
      forward,
      eastWest,
      emergencyStop
    });
  }

  // 0x02.0x04
  private parseVehicleFunction(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const functionNumber = buffer.readUInt16LE(2);
    const functionState = buffer.readUInt16LE(4);

    const functionActive = functionState !== 0x00;

    this.onCallFunction.next({
      nid: NID,
      functionNumber,
      functionState: functionActive
    });
  }
}

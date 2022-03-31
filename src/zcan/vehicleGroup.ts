/* eslint-disable  @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';
import {Subject} from "rxjs";
import {CallFunctionData, VehicleSpeedData} from "../@types/models";

export default class VehicleGroup {
  private mx10: MX10;

  public readonly onChangeSpeed = new Subject<VehicleSpeedData>();
  public readonly onCallFunction = new Subject<CallFunctionData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  changeSpeed(
    vehicleAddress: number,
    speed_direction: number,
  ) {

    this.mx10.sendData(0x02, 0x02, [
      {value: vehicleAddress, length: 2},
      {value: speed_direction, length: 2},
      {value: 0x0000, length: 2},
    ]);
  }

  callFunction(vehicleAddress: number, buttonId: number, status: boolean) {
    this.mx10.sendData(0x02, 0x04, [
      {value: vehicleAddress, length: 2},
      {value: buttonId, length: 2},
      {value: Number(status), length: 2},
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
      case 0x02:
        this.parseVehicleSpeed(size, mode, nid, buffer);
        break;
      case 0x04:
        this.parseVehicleFunction(size, mode, nid, buffer);
        break;
    }
  }

  // 0x02.0x02
  private parseVehicleSpeed(size: number, mode: number, nid: number, buffer: Buffer) {
    const NID = buffer.readUInt16LE(0);
    const speedAndDirection = buffer.readUInt16LE(2);
    const divisor = buffer.readUint8(4);

    this.onChangeSpeed.next({
      nid: NID,
      divisor,
      speedAndDirection
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

    this.onCallFunction.next({
      nid: NID,
      functionNumber,
      functionState
    });
  }
}

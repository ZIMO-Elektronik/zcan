import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { CallFunctionData, CallSpecialFunctionData, VehicleStateData, VehicleSpeedData } from '../@types/models';
import { Direction, DirectionDefault, Manual, MaxSpeedSteps, OperatingMode, ShuntingFunction, SpecialFunctionMode } from '../util/enums';
import { MsgVehicleMode } from './vehicleMsg';
export default class VehicleGroup {
    readonly onVehicleState: Subject<VehicleStateData>;
    readonly onVehicleMode: Subject<MsgVehicleMode>;
    readonly onChangeSpeed: Subject<VehicleSpeedData>;
    readonly onCallFunction: Subject<CallFunctionData>;
    readonly onCallSpecialFunction: Subject<CallSpecialFunctionData>;
    private modeQ;
    private mx10;
    constructor(mx10: MX10);
    getVehicleMode(trainNid: number): Promise<MsgVehicleMode | undefined>;
    setVehicleMode(trainNid: number, opMode: OperatingMode, speedSteps: MaxSpeedSteps): Promise<MsgVehicleMode | undefined>;
    changeSpeed(vehicleAddress: number, speedStep: number, forward: boolean, eastWest?: Direction, emergencyStop?: boolean): void;
    callFunction(vehicleAddress: number, functionId: number, functionStatus: boolean): void;
    changeSpecialFunction(vehicleAddress: number, specialFunctionMode: SpecialFunctionMode, specialFunctionStatus: Manual | ShuntingFunction | DirectionDefault): void;
    vehicleState(vehicleAddress: number): void;
    activeModeTrain(vehicleAddress: number): void;
    activeModeTakeOver(vehicleAddress: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseVehicleState;
    private parseVehicleMode;
    private parseVehicleSpeed;
    private parseVehicleFunction;
    private parseVehicleSpecialFunction;
}

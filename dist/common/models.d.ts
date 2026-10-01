import { NameType, Direction, ExternalController, FunctionMode, SystemStateMode, TrackMode, ImageType, FxConfigType, AccessoryMode, FxModeType } from './enums';
import { ZcanDataArray } from './communication';
export interface Train {
    nid: number;
    subId: number;
    name: string;
    group: number;
    image?: string;
    externalController?: ExternalController;
    tacho: string;
    speedFwd: number;
    speedRev: number;
    speedRange: number;
    driveType: number;
    era: string;
    countryCode: number;
    functions: TrainFunction[];
}
export interface LocoGuiMXExtended {
    nid: number;
    name: string;
    image?: string;
    destructuredBuffer: ZcanDataArray;
    functions: TrainFunction[];
}
export interface TrainFunction {
    mode: FunctionMode;
    icon?: string;
    active: boolean;
}
export interface DataNameExtendedData {
    nid: number;
    name: string;
}
export interface LocoSpeedTabExtended {
    srcid: number;
    nid: number;
    dbat6: number;
    speedTab: SpeedTabData[] | undefined;
}
export interface SpeedTabData {
    id: number;
    speedStep: number;
    speed: number;
}
export interface GroupCountData {
    objectType: number;
    number: number;
}
export interface ItemListByIndexData {
    nid: number;
    index: number;
    msSinceLastCommunication: number;
}
export interface ItemListByNidData {
    nid: number;
    index: number;
    itemState: number;
    lastTick: number;
}
export interface DataNameExtended {
    nid: number;
    type: NameType;
    subID: number;
    value1: DataNameValue1 | undefined;
    value2: number;
    name: string;
}
export interface ModulePowerInfoData {
    deviceNID: number;
    port1Status: TrackMode;
    port1Voltage: number;
    port1Amperage: number;
    port2Status: TrackMode;
    port2Voltage: number;
    port2Amperage: number;
    amperage32V: number;
    amperage12V: number;
    voltageTotal: number;
    temperature: number;
}
export interface VehicleStateData {
    nid: number;
    ctrlTick: number;
    ctrlDevice: number;
}
export interface VehicleSpeedData {
    nid: number;
    divisor: number;
    speedStep: number;
    forward: boolean;
    eastWest: Direction;
    emergencyStop: boolean;
}
export interface CallFunctionData {
    nid: number;
    functionNumber: number;
    functionState: boolean;
}
export interface SystemStateData {
    nid: number;
    port: number;
    mode: SystemStateMode;
}
export interface RemoveLocomotiveData {
    nid: number;
    state: number;
}
export interface TrainFlags {
    deleted: boolean;
}
export interface DataNameValue1 {
    type: string;
    cfgNum: number;
}
export interface ItemImageData {
    nid: number;
    type: ImageType;
    imageId: number;
}
export interface ItemFxMode {
    nid: number;
    group: number;
    mode: FxModeType[];
}
export interface ItemFxConfig {
    nid: number;
    function: number;
    item: FxConfigType;
    data: number;
}
export interface TseInfoExtended {
    nid: number;
    cfgNum: number;
    cvState: number;
    cvCode: number;
}
export interface TseProgReadExtended {
    nid: number;
    cfgNum: number;
    cvValue: number;
}
export interface TseProgWriteExtended {
    nid: number;
    cfgNum: number;
    cvValue: number;
}
export interface PingResponseExtended {
    connected: boolean;
}
export interface LocoStateData {
    nid: number;
    type: number;
    ownerNid: number;
    trainNid: number;
    lastControlledTime: number;
    railComData: number;
    functionsStates: boolean[];
    sentDCCData: number;
    receivedRailcomData: number;
}
export interface AccessoryModeData {
    nid: number;
    mode: AccessoryMode;
}
export interface AccessoryPortData {
    nid: number;
    type: number;
    port: number;
}
export interface AccessoryPin4Data {
    nid: number;
    pin: number;
    state: number;
}

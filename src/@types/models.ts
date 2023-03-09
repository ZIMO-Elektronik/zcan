import {
  NameType,
  Direction,
  ExternalController,
  FunctionMode,
  OperatingMode,
  SystemStateMode,
  TrackMode,
  ImageType,
  FxInfoType,
  SpecialFunctionMode,
  Manual,
  DirectionDefault,
  ShuntingFunction,
  BidiType,
  ForwardOrReverse,
} from 'src/util/enums';

export interface Train {
  nid: number;
  subId: number;
  name: string;
  group: number;
  image?: string;
  externalController?: ExternalController;
  operatingMode: OperatingMode;
  tacho: string;
  speedFwd: number;
  speedRev: number;
  speedRange: number;
  driveType: number;
  era: string;
  countryCode: number;
  functions: TrainFunction[];
}

export interface TrainFunction {
  mode: FunctionMode;
  icon?: string;
  active: boolean;
}

export interface DataValueExtendedData {
  nid: number;
  functionCount: number;
  speedStep: number;
  forward: boolean;
  eastWest: Direction;
  emergencyStop: boolean;
  operatingMode: OperatingMode;
  functionsStates: boolean[];
  flags: TrainFlags;
  shuntingFunction: ShuntingFunction;
  manualMode: Manual;
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

export interface BidiInfoData {
  nid: number;
  type: BidiType;
  data: BidiDirectionData | number;
}

export interface BidiDirectionData {
  direction?: Direction;
  forwardOrReverse?: ForwardOrReverse;
  directionChange?: boolean;
  directionConfirm?: boolean;
}

export interface VehicleModeData {
  nid: number;
  speedSteps: number | undefined;
  operatingMode: OperatingMode;
  mode2: number;
  mode3: number;
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
export interface CallSpecialFunctionData {
  nid: number;
  specialFunctionMode: SpecialFunctionMode;
  specialFunctionState: Manual | ShuntingFunction | DirectionDefault;
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

export interface ItemFxInfo {
  nid: number;
  function: number;
  type: FxInfoType;
  data: number;
}

import {ExternalController, FunctionMode, OperatingMode} from "../util/enums";

interface Train {
  nid: number,
  subId: number,
  name: string,
  group: number,
  image: string,
  externalController?: ExternalController,
  operatingMode: OperatingMode,
  tacho: string,
  vMaxFWD: number,
  vMaxREV: number,
  vRange: number,
  driveType: number,
  era: string,
  countryCode: number,
  functions: TrainFunction[],
}

interface TrainFunction {
  mode: FunctionMode,
  icon?: string,
  active: boolean,
}

interface DataValueExtendedData {
  nid: number,
  speedAndDirection: number,
  operatingMode: OperatingMode,
  functionsStates: boolean[]
}

interface GroupCountData {
  objectType: number,
  number: number,
}

interface ItemListByIndexData {
  nid: number,
  index: number,
  msSinceLastCommunication: number,
}

interface ItemListByNidData {
  nid: number,
  index: number,
  itemState: number,
  lastTick: number
}

interface ModulePowerInfoData {
  deviceNID: number,
  port1Status: number,
  port1Voltage: number,
  port1Amperage: number,
  port2Status: number,
  port2Voltage: number,
  port2Amperage: number,
  amperage32V: number,
  amperage12V: number,
  voltageTotal: number,
  temperature: number,
}

interface BidiInfoData {
  nid: number,
  type: number,
  data: number,
}

interface VehicleSpeedData {
  nid: number,
  divisor: number,
  speedAndDirection: number
}

interface CallFunctionData {
  nid: number,
  functionNumber: number,
  functionState: number
}

interface SystemStateData {
  nid: number,
  port: number,
  mode: number
}

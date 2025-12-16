export enum OperatingMode {
  UNKNOWN = '',
  DCC = 'DCC',
  MM1 = 'MM1',
  MM2 = 'MM2',
  SX = 'SX',
  MFX = 'mfx',
  NOT_DEFINED = 'N/A',
  SYS = 'System',
}

export const getOperatingMode = (val: number) => {
  // eslint-disable-next-line no-bitwise
  const mode = val >> 4;
  const modes = Object.values(OperatingMode);
  if (mode >= 1 && mode <= 7) {
    return modes[mode];
  }
  return OperatingMode.UNKNOWN;
};

export enum MaxSpeedSteps {
  UNKNOWN,
  MAX14,
  MAX27,
  MAX28,
  MAX128,
  MAX1024,
}

export enum ExternalController {
  /** external controll: active on another controller */
  FS = 'FS',
  /** vehicle intergrated to its own traction T1, T2 */
  T1 = 'T1',
  T2 = 'T2',
  FT = 'FT',
  /** FT(...) f.e. FT(2) external traction on different controller */
  FT2 = 'FT(2)',
  /** external traction active on different controller */
  FS2 = 'FS(2)',
}

/**
 * Enum describing how given functions behaves.
 */
export enum FunctionMode {
  /** Functions needs to be pressed down and held to remain activated */
  momentary,

  /** Functions works as standart toggle switch */
  switch,
}

export enum SystemStateMode {
  NORMAL = 1,
  SSP0 = 2,
  SSPe = 3,
  OFF = 4,
  SERVICE = 5,
  OVERRCURRENT = 10,
}

export enum TrackMode {
  OFF = -1,
  NORMAL = 0,
  SSP0 = 1,
  SSPe = 2,
  SMP = 4,
  UPDATE = 5,
  SOUND = 6,
  ERROR = 8,
  ERROR_SMP = 9,
}

export enum Direction {
  UNDEFINED = 0,
  EAST = 1,
  WEST = 2,
}

export enum NameType {
  VEHICLE,
  RAILWAY,
  CONNECTION,
  MANUFACTURER,
  DECODER,
  DESIGNATION,
  CFGDB,
  ICON,
  ZIMO_PARTNER,
  LAND,
  COMPANY_CV,
}

export enum ImageType {
  VEHICLE = 1,
  VEHICLE_CRC32 = 2,
  TACHO = 3,
  VEHICLE_INSTRUMENT_BRAKE_BAR = 10,
  VEHICLE_INSTRUMENT = 0x1f,
}

export enum FxModeType {
  TOGGLE = 0b00,
  MOMENT = 0b01,
  TIMEOUT = 0b10,
  EXTENDED = 0b11,
}

export enum FxConfigType {
  REDIRECT_ADDR = 0x01,
  MODE = 0x02,
  FREE = 0x03,
  TIME_VALUE_1 = 0x04,
  TIME_VALUE_2 = 0x05,
  ICON = 0x10,
  SOUND = 0x11,
}

export enum SpecialFunctionMode {
  MANUAL = 1,
  SHUNTING_FUNCTION = 2,
  DIRECTION_DEFAULT = 3,
}

export enum Manual {
  OFF = 0,
  ON = 1,
}

export enum ShuntingFunction {
  OFF = 0,
  AZBZ = 1,
  HALF = 2,
}

export enum DirectionDefault {
  NO_CHANGE = 0,
  DIRECTION_EAST = 1,
  DIRECTION_WEST = 2,
}

export enum BidiType {
  RAILCOM_STATISTICS = 0x0000,
  SPEED_REPORT = 0x0100,
  TILT_AND_CURVE = 0x0101,
  CV = 0x0200,
  QOS = 0x0300,
  FILL_LEVEL = 0x0400,
  DIRECTION = 0x0800,
  TRACK_VOLTAGE = 0x1000,
  ALARMS = 0x1100,
}

export enum ForwardOrReverse {
  UNKNOWN = 0,
  FORWARD = 1,
  REVERSE = 2,
}

export enum AccessoryMode {
  UNKNOWN = 0,
  PAIRED = 1,
  SINGLE = 2,
}

export enum AccessoryPortState {
  ON = 'on',
  OFF = 'off',
  UNKNOWN = 'unknown',
}

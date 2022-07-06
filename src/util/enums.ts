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
  SSPe= 3,
  OFF=4,
  SERVICE=5,
  OVERRCURRENT = 10
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

export enum DataNameUse {
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
import {modeBites_____} from "../internal/bites";

export enum OperatingMode {
  UNKNOWN = '',
  DCC = 'DCC',
  MM2 = 'MM2',
  NOT_DEFINED = 'N/A',
  MFX = 'mfx',
}

export const getOperatingMode = (val: number) => {
  // eslint-disable-next-line no-bitwise
  const mode = val & modeBites_____;
  const modes = Object.values(OperatingMode);
  if (mode === 1 || mode === 2 || mode === 4) {
    return modes[mode];
  }
  return OperatingMode.UNKNOWN;
};

export enum ExternalController {
  FS = 'FS', // external controll: active on another controller
  T1 = 'T1', // vehicle intergrated to its own traction T1, T2
  T2 = 'T2',
  FT = 'FT',
  FT2 = 'FT(2)', // FT(...) f.e. FT(2) external traction on different controller
  FS2 = 'FS(2)', // external traction active on different controller
}

export enum FunctionMode {
  momentary,
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

export enum Direction {
  UNDEFINED = 0,
  EAST = 1,
  WEST = 2,
}

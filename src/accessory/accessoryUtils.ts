import {AccessoryPortState, Direction, HluSignal} from '../common/enums';
import {HluAspect, HluState} from '../common/models';

export const steinNid = (module: number) => 0xd000 + module;

//mask so out-of-range hlu/dir values can't spill into the flag bits
const encodeAspect = (aspect: HluAspect) =>
  0x80 | ((aspect.dir & 0x03) << 4) | (aspect.hlu & 0x0f);

const decodeAspect = (byte: number): HluAspect => ({
  hlu: (byte & 0x0f) as HluSignal,
  dir: ((byte >> 4) & 0x03) as Direction,
});

export const encodeHlu = (state: HluState): number =>
  ((state.contact ? encodeAspect(state.contact) : 0x00) << 8) | encodeAspect(state);

export const decodeHlu = (value: number): HluState => {
  const state: HluState = decodeAspect(value);
  if (value & 0x8000)
    state.contact = decodeAspect(value >> 8);
  return state;
};

export const parseAccessory4Byte = (accessoryState: number) => {
  const portStates = new Map<number, AccessoryPortState>();

  for (let i = 0; i < 8; i++) {
    const onBit = 1 << (i * 2);
    const offBit = 1 << (i * 2 + 1);

    if (accessoryState & onBit) {
      portStates.set(i + 1, AccessoryPortState.ON);
    } else if (accessoryState & offBit) {
      portStates.set(i + 1, AccessoryPortState.OFF);
    } else {
      portStates.set(i + 1, AccessoryPortState.UNKNOWN);
    }
  }

  return portStates;
};

export const parseAccessory8byte = (accessoryState: number) => {
  const portStates = new Map<number, AccessoryPortState>();

  for (let i = 0; i < 8; i++) {
    const onBit = 1 << i;
    const offBit = 1 << (i + 1);

    if (accessoryState & onBit) {
      portStates.set(i + 1, AccessoryPortState.ON);
    } else if (accessoryState & offBit) {
      portStates.set(i + 1, AccessoryPortState.OFF);
    } else {
      portStates.set(i + 1, AccessoryPortState.UNKNOWN);
    }
  }

  return portStates;
};

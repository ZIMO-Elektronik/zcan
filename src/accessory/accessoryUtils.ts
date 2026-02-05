import {AccessoryPortState} from '../common/enums';

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

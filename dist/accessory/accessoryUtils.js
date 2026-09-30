import { AccessoryPortState } from '../common/enums';
export const steinNid = (module) => 0xd000 + module;
const encodeAspect = (aspect) => 0x80 | ((aspect.dir & 0x03) << 4) | (aspect.hlu & 0x0f);
const decodeAspect = (byte) => ({
    hlu: (byte & 0x0f),
    dir: ((byte >> 4) & 0x03),
});
export const encodeHlu = (state) => ((state.contact ? encodeAspect(state.contact) : 0x00) << 8) | encodeAspect(state);
export const decodeHlu = (value) => {
    const state = decodeAspect(value);
    if (value & 0x8000)
        state.contact = decodeAspect(value >> 8);
    return state;
};
export const parseAccessory4Byte = (accessoryState) => {
    const portStates = new Map();
    for (let i = 0; i < 8; i++) {
        const onBit = 1 << (i * 2);
        const offBit = 1 << (i * 2 + 1);
        if (accessoryState & onBit) {
            portStates.set(i + 1, AccessoryPortState.ON);
        }
        else if (accessoryState & offBit) {
            portStates.set(i + 1, AccessoryPortState.OFF);
        }
        else {
            portStates.set(i + 1, AccessoryPortState.UNKNOWN);
        }
    }
    return portStates;
};
export const parseAccessory8byte = (accessoryState) => {
    const portStates = new Map();
    for (let i = 0; i < 8; i++) {
        const onBit = 1 << i;
        const offBit = 1 << (i + 1);
        if (accessoryState & onBit) {
            portStates.set(i + 1, AccessoryPortState.ON);
        }
        else if (accessoryState & offBit) {
            portStates.set(i + 1, AccessoryPortState.OFF);
        }
        else {
            portStates.set(i + 1, AccessoryPortState.UNKNOWN);
        }
    }
    return portStates;
};
//# sourceMappingURL=accessoryUtils.js.map
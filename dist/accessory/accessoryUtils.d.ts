import { AccessoryPortState } from '../common/enums';
import { HluState } from '../common/models';
export declare const steinNid: (module: number) => number;
export declare const encodeHlu: (state: HluState) => number;
export declare const decodeHlu: (value: number) => HluState;
export declare const parseAccessory4Byte: (accessoryState: number) => Map<number, AccessoryPortState>;
export declare const parseAccessory8byte: (accessoryState: number) => Map<number, AccessoryPortState>;

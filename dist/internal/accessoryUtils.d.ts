import { AccessoryPortState } from '../util/enums';
export declare const parseAccessory4Byte: (accessoryState: number) => Map<number, AccessoryPortState>;
export declare const parseAccessory8byte: (accessoryState: number) => Map<number, AccessoryPortState>;

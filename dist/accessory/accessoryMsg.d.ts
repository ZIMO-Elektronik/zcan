import { MsgMode } from "../common/enums";
import { Header, Message } from "../common/communication";
import { Buffer } from 'buffer';
export declare class MsgAccessoryMode extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    static log: (msg: string) => void;
    constructor(header: Header, mode?: number);
    get nid(): number;
    get mode(): number;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgAccessoryMode;
}
export interface HluAspect {
    hlu: number;
    dir: number;
}
export interface HluState extends HluAspect {
    contact?: HluAspect;
}
export declare class MsgAccessoryPin6 extends Message {
    static readonly TYPE_OCCUPANCY = 1;
    static readonly TYPE_HLU = 2;
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    constructor(header: Header, pin: number, type: number, value?: number);
    get nid(): number;
    get pin(): number;
    get type(): number;
    get state(): number | undefined;
    static encodeAspect(aspect: HluAspect): number;
    static decodeAspect(byte: number): HluAspect;
    static encodeHlu(state: HluState): number;
    static decodeHlu(value: number): HluState;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgAccessoryPin6;
}

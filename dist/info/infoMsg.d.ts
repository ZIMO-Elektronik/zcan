import { Header, Message, ZcanDataArray } from "../common/communication";
import { BidiType, ModInfoType, MsgMode } from "../common/enums";
import { Buffer } from 'buffer';
export declare class MsgModInfo extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, type: ModInfoType, data?: ZcanDataArray);
    type(): ModInfoType | undefined;
    info(): number | undefined;
}
export declare class MsgBidiInfo extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, type: number, nid?: number, info?: number);
    get nid(): number;
    get type(): BidiType;
    get info(): number | undefined;
    static fromBuffer(mode: number, buf: Buffer): MsgBidiDir | MsgBidiSpeed | MsgBidiInfo;
}
export declare class MsgBidiSpeed extends MsgBidiInfo {
    constructor(header: Header, nid?: number, info?: number);
    get speed(): number | undefined;
    static fromBuffer(mode: number, buf: Buffer): MsgBidiSpeed;
}
export declare class MsgBidiDir extends MsgBidiInfo {
    constructor(header: Header, nid?: number, info?: number);
    get fwd(): boolean | undefined;
    get east(): boolean | undefined;
    get change(): boolean | undefined;
    get confirm(): boolean | undefined;
    static fromBuffer(mode: number, buf: Buffer): MsgBidiDir;
}

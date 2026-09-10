import { Header, Message } from "../common/communication";
import { MsgMode, NameType } from "../common/enums";
import { Buffer } from 'buffer';
export declare class MsgGroupCount extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, group?: number, count?: number);
    group(): number | undefined;
    count(): number;
}
export declare class MsgItemsByIndexReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, mx10Nid: number, groupNid: number, index: number);
}
export declare class MsgItemsByIndexRsp extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, index: number, nid: number, state: number);
    get index(): number;
    get nid(): number;
    get state(): number;
    static fromBuffer(mode: MsgMode, nid: number, buf: Buffer): MsgItemsByIndexRsp;
}
export declare class MsgItemsByNidReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, precedingNid: number);
}
export declare class MsgItemsByNidRsp extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, itemNid: number, index: number, itemState: number, lastTick: number | undefined);
    itemNid(): number;
    index(): number;
    itemState(): number;
    lastTick(): number;
}
export declare class MsgDataName extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, subId: number, name?: string, v1?: number, v2?: number);
    itemNid(): number;
    subId(): number;
    value1(): number;
    value2(): number;
    name(): string | undefined;
    type(): NameType;
    static fromBuffer(mode: MsgMode, mx10Nid: number, buffer: Buffer): MsgDataName;
}
export declare class MsgItemImage extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, itemNid: number, imageType: number, imageId?: number);
    itemNid(): number;
    imageType(): number;
    imageId(): number;
}
export declare class MsgDataClear extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, nidOrState: number);
    nid(): number;
    state(): number;
}

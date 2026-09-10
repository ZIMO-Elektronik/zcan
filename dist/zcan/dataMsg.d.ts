import { Header, Message } from "../@types/communication";
import { MsgMode } from "../util/enums";
export declare class MsgItemsByIndexReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, mx10Nid: number, groupNid: number, index: number);
}
export declare class MsgItemsByIndexRsp extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, index: number, itemNid: number, itemState: number, lastTick: number | undefined);
    index(): number;
    itemNid(): number;
    itemState(): number;
    lastTick(): number;
}
export declare class MsgItemsByNidReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, mx10Nid: number, precedingNid: number);
}
export declare class MsgItemsByNidRsp extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, itemNid: number, index: number, itemState: number, lastTick: number | undefined);
    itemNid(): number;
    index(): number;
    itemState(): number;
    lastTick(): number;
}

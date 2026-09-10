import { Header, Message } from "../common/communication";
import { MsgMode } from "../common/enums";
export declare class MsgPortOpen extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, clientId: number, comFlags?: number, clientName?: string);
    comFlags(): number | undefined;
    clientId(): number;
    clientName(): string | 0;
}
export declare class MsgPortClose extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, myNid: number);
}
export declare class MsgPing extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, masterUid?: number, type?: number, session?: number);
    nid(): number;
    masterUid(): number;
    type(): number;
    session(): number;
}

import { Header, Message } from "../@types/communication";
import { MsgMode } from "../util/enums";
export declare class MsgCvRead extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal?: number | undefined);
    trainNid(): number;
    cvNum(): number;
    cvVal(): number | undefined;
}
export declare class MsgCvWrite extends MsgCvRead {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal: number);
}
export declare class MsgCvWrite16 extends MsgCvRead {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal: number);
}

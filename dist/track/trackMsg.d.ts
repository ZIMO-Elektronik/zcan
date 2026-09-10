import { Header, Message } from "../common/communication";
import { MsgMode } from "../common/enums";
export declare class MsgCvRead extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal?: number | undefined);
    get nid(): number;
    get cvNum(): number;
    get cvVal(): number | undefined;
}
export declare class MsgCvWrite extends MsgCvRead {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal: number);
}
export declare class MsgCvWrite16 extends MsgCvRead {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, cvVal: number);
}
export declare class MsgCvWriteBit extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, trainNid: number, cvNum: number, bitNum: number, bitVal: number);
    get nid(): number;
    get cvNum(): number;
    get bitNum(): number | undefined;
    get bitVal(): number | undefined;
}

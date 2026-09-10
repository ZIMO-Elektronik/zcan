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

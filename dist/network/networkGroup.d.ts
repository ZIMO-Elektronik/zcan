import { Subject } from 'rxjs';
import MX10 from '../MX10';
import { Buffer } from 'buffer';
import { MsgPing, MsgPortClose } from './networkMsg';
export default class NetworkGroup {
    readonly onPing: Subject<MsgPing>;
    readonly onPortClose: Subject<MsgPortClose>;
    private pingQ;
    private portCloseQ;
    private mx10;
    constructor(mx10: MX10);
    ping(nid?: number): Promise<MsgPing | undefined>;
    portClose(): Promise<void>;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parsePing(size: number, mode: number, nid: number, buffer: Buffer): void;
}

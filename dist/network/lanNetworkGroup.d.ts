import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { MsgPortOpen } from './networkMsg';
import { Buffer } from 'buffer';
export default class LanNetworkGroup {
    readonly onPortOpen: Subject<MsgPortOpen>;
    private portOpenQ;
    private mx10;
    constructor(mx10: MX10);
    portOpen(clientName: string, clientId: number, comFlags?: number): Promise<MsgPortOpen | undefined>;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parsePortOpen(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseCmd0f(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseUnknownCommand(size: number, mode: number, nid: number, buffer: Buffer): void;
}

import { Subject } from 'rxjs';
import MX10 from '../../MX10';
import { Buffer } from 'buffer';
import { PingResponseExtended } from '../../@types/models';
export default class NetworkGroup {
    readonly onPingResponse: Subject<PingResponseExtended>;
    private mx10;
    pingTimeout: NodeJS.Timeout | null;
    constructor(mx10: MX10);
    ping(mode?: number): void;
    portClose(): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    pingResponse(size: number, mode: number, nid: number, _buffer: Buffer): void;
}

import MX10 from '../../MX10';
import { Subject } from 'rxjs';
export default class LanNetworkGroup {
    private mx10;
    readonly onPortOpen: Subject<boolean>;
    constructor(mx10: MX10);
    portOpen(): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parsePortOpen(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseUnknownCommand(size: number, mode: number, nid: number, buffer: Buffer): void;
}

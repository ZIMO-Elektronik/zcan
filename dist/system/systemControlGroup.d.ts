import MX10 from '../MX10';
import { SystemStateMode } from '../common/enums';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';
import { SystemStateData } from '../common/models';
export default class SystemControlGroup {
    private mx10;
    readonly onSystemStateChange: Subject<SystemStateData>;
    constructor(mx10: MX10);
    systemState(mode: SystemStateMode, port?: number, device?: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseSystemState;
}

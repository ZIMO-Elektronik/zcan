import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { ModulePowerInfoData } from '../common/models';
import { Buffer } from 'buffer';
export default class LanInfoGroup {
    private mx10;
    readonly onModulePowerInfo: Subject<ModulePowerInfoData>;
    constructor(mx10: MX10);
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseModulePowerInfo;
    private parsePortStatus;
}

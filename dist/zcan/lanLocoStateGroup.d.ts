import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { LocoStateData } from '../@types/models';
export default class LanLocoStateGroup {
    private mx10;
    readonly onLocoStateExtended: Subject<LocoStateData>;
    constructor(mx10: MX10);
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseLocoStateExtended;
}

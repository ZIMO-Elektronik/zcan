import MX10 from '../../MX10';
import { Buffer } from 'buffer';
export default class LanZimoProgrammableScriptGroup {
    private mx10;
    constructor(mx10: MX10);
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
}

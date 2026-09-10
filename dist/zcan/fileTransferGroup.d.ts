import { Buffer } from 'buffer';
import MX10 from '../MX10';
export default class FileTransferGroup {
    private mx10;
    constructor(mx10: MX10);
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
}

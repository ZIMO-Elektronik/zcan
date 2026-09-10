import { Subject } from 'rxjs';
import MX10 from '../MX10';
export default class AccessoryCommandGroup {
    readonly onAccessoryMode: Subject<AccessoryModeData>;
    readonly onAccessoryPort: Subject<AccessoryPortData>;
    readonly onAccessoryPin: Subject<AccessoryPinData>;
    private mx10;
    constructor(mx10: MX10);
    accessoryModeByNid(nid: number): void;
    accessoryPortByNid(nid: number): void;
    accessoryPortByPin(nid: number, pin: number, state: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryMode(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPort(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPin(size: number, mode: number, nid: number, buffer: Buffer): void;
}

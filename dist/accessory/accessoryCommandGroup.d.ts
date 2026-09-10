import { Subject } from 'rxjs';
import MX10 from '../MX10';
import { AccessoryPin4Data, AccessoryPin6Data, AccessoryPortData } from '../common/models';
import { MsgAccessoryMode } from './accessoryMsg';
export default class AccessoryCommandGroup {
    readonly onAccessoryMode: Subject<MsgAccessoryMode>;
    readonly onAccessoryPort: Subject<AccessoryPortData>;
    readonly onAccessoryPin4: Subject<AccessoryPin4Data>;
    readonly onAccessoryPin6: Subject<AccessoryPin6Data>;
    private modeQ;
    private mx10;
    constructor(mx10: MX10);
    getAccessoryMode(nid: number): Promise<MsgAccessoryMode | undefined>;
    accessoryModeByNid(nid: number): void;
    accessoryPortByNid(nid: number): void;
    accessoryPortByPin(nid: number, pin: number, state: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryMode(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPort(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPin4(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPin6(size: number, mode: number, nid: number, buffer: Buffer): void;
}

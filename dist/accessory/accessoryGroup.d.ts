import { Subject } from 'rxjs';
import MX10 from '../MX10';
import { AccessoryPin4Data, AccessoryPortData } from '../common/models';
import { AccessoryMode } from '../common/enums';
import { MsgAccessoryMode, MsgAccessoryPin6 } from './accessoryMsg';
import { Buffer } from 'buffer';
export default class AccessoryGroup {
    readonly onAccessoryMode: Subject<MsgAccessoryMode>;
    readonly onAccessoryPort: Subject<AccessoryPortData>;
    readonly onAccessoryPin4: Subject<AccessoryPin4Data>;
    readonly onAccessoryPin6: Subject<MsgAccessoryPin6>;
    private modeQ;
    private mx10;
    constructor(mx10: MX10);
    getAccessoryMode(nid: number): Promise<MsgAccessoryMode | undefined>;
    setAccessoryMode(nid: number, mode: AccessoryMode): Promise<MsgAccessoryMode | undefined>;
    private pin6Query;
    getAccessoryPin6(nid: number, pin: number, type: number): Promise<MsgAccessoryPin6 | undefined>;
    setAccessoryPin6(nid: number, pin: number, type: number, value: number): Promise<MsgAccessoryPin6 | undefined>;
    accessoryModeByNid(nid: number): void;
    accessoryPortByNid(nid: number): void;
    accessoryPortByPin(nid: number, pin: number, state: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryMode(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPort(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPin4(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseAccessoryPin6(size: number, mode: number, nid: number, buffer: Buffer): void;
}

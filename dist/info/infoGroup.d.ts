import { Buffer } from 'buffer';
import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { BidiType, ModInfoType } from '../common/enums';
import { MsgBidiDir, MsgBidiInfo, MsgBidiSpeed, MsgModInfo } from './infoMsg';
export default class InfoGroup {
    private mx10;
    readonly onBidiDir: Subject<MsgBidiDir>;
    readonly onBidiSpeed: Subject<MsgBidiSpeed>;
    readonly onBidiInfo: Subject<MsgBidiInfo>;
    readonly onModuleInfoChange: Subject<MsgModInfo>;
    private modInfoQ;
    private bidiQ;
    private bidiDirQ;
    private bidiSpeedQ;
    constructor(mx10: MX10);
    getModuleInfo(nid: number, type: ModInfoType | number): Promise<MsgModInfo | undefined>;
    getBidiDir(nid: number): Promise<MsgBidiDir | undefined>;
    getBidiSpeed(nid: number): Promise<MsgBidiSpeed | undefined>;
    getBidiInfo(locoNid: number, type: BidiType): Promise<MsgBidiInfo | undefined>;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseModuleInfo;
    private parseBidiInfo;
}

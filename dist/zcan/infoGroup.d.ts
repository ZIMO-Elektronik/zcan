import { Buffer } from 'buffer';
import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { BidiInfoData } from '../@types/models';
import { ModInfoType } from '../util/enums';
import { MsgModInfo } from './infoMsg';
export default class InfoGroup {
    private mx10;
    readonly onBidiInfoChange: Subject<BidiInfoData>;
    readonly onModuleInfoChange: Subject<MsgModInfo>;
    private modInfoQ;
    constructor(mx10: MX10);
    getModuleInfo(nid: number, type: ModInfoType | number): Promise<MsgModInfo | undefined>;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    private parseModuleInfo;
    private parseBidiInfo;
    private parseEastWest;
    private parseDirChange;
    private parseFwdRev;
    private parseDirectionConfirm;
}

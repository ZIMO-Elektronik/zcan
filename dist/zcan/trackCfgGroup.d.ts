import { TseInfoExtended } from '../@types/models';
import MX10 from '../MX10';
import { Subject } from 'rxjs';
import { MsgCvRead, MsgCvWrite, MsgCvWrite16 } from './trackCfgMsg';
export default class TrackCfgGroup {
    readonly onTseInfoExtended: Subject<TseInfoExtended>;
    readonly onTseProgReadExtended: Subject<MsgCvRead>;
    readonly onTseProgWriteExtended: Subject<MsgCvWrite>;
    readonly onTseProgWrite16Extended: Subject<MsgCvWrite16>;
    private getCvQ;
    private setCvQ;
    private mx10;
    constructor(mx10: MX10);
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parseTseInfo(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseTseProgRead(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseTseProgWrite(size: number, mode: number, nid: number, buffer: Buffer): void;
    parseTseProgWrite16(size: number, mode: number, nid: number, buffer: Buffer): void;
    tseProgRead(NID: number, CV: number): void;
    tseProgWrite(NID: number, CV: number, value: number): void;
    tseProgWrite16(NID: number, CV: number, value: number): void;
    getCv(trainNid: number, cvNum: number): Promise<MsgCvRead | undefined>;
    setCv(trainNid: number, cvNum: number, cvVal: number): Promise<MsgCvWrite | undefined>;
    setCv16(trainNid: number, cvNum: number, cvVal: number): Promise<MsgCvWrite16 | undefined>;
}

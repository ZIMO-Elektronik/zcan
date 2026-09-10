import { StepMax, MsgMode, OpMode } from "../common/enums";
import { Header, Message, ZcanData } from "../common/communication";
import { Buffer } from 'buffer';
import { TrainFunction } from '../common/models';
export declare class MsgLocoGuiReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, locoNid: number, subNid: number);
    locoNid(): number;
    subNid(): number;
}
export declare class MsgLocoGuiRsp extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, locoNid: number, subNid: number, version: number, flags: number, group: number, name: string, imageId: number, imageCrc: number, tachoId: number, tachoCrc: number, speedFwd: number, speedRev: number, speedRnk: number, driveType: number, era: number, country: number, funImgs: number[], funModes: number[]);
    locoNid(): number;
    subNid(): number;
    group(): number;
    name(): string;
    imageId(): number;
    tacho(): number;
    speedFwd(): number;
    speedRev(): number;
    speedRnk(): number;
    driveType(): number;
    era(): number;
    country(): number;
    functions(): Array<TrainFunction>;
    static parseEra(era: number): "" | "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";
}
export declare class MsgDataValueX extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, nid: number, subId: number, data?: ZcanData[]);
    get nid(): number;
    get subId(): number;
    get decoder(): {
        vendor: number;
        uid: number;
        type: number;
        sound: number;
    };
    get stepMax(): StepMax;
    get opMode(): OpMode;
    get funCount(): number;
    get txCount(): number;
    get rxCount(): number;
    get something(): number;
    get owner(): {
        nid: number;
        tick: number;
    };
    get groupie(): {
        nid: number;
        tick: number;
    };
    get dirBits(): {
        reverseCmd: boolean;
        reverseAck: boolean;
        stop: boolean;
    };
    get speedStep(): number;
    get digtalFun(): boolean[];
    get specialFun(): {
        shunt: number;
        man: number;
    };
    get analogFun(): {
        id: number;
        state: number;
    }[];
    static fromBuffer(mode: MsgMode, nid: number, buffy: Buffer): MsgDataValueX;
}
export declare class MsgItemListByIdxX extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, idx: number, data?: ZcanData[], group?: number);
    get idx(): number;
    get nid(): number;
    get stepMax(): StepMax;
    get opMode(): OpMode;
    get speedStep(): number;
    get direction(): boolean;
    get directionAck(): boolean;
    get eastWest(): number;
    get railCom(): boolean;
    get zimoAck(): boolean;
    get eStop(): boolean;
    get cabEw(): boolean;
    get hasTrain(): boolean;
    get deleted(): boolean;
    get fxCount(): number;
    get axCount(): number;
    get fxState(): boolean[];
    get owner(): {
        nid: number;
        tick: number;
    };
    get trainNid(): number;
    static fromBuffer(mode: MsgMode, nid: number, buffy: Buffer): MsgItemListByIdxX;
}

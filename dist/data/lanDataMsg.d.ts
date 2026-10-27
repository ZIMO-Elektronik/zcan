import { StepMax, MsgMode, OpMode } from "../common/enums";
import { Header, Message, ZcanData } from "../common/communication";
import { Buffer } from 'buffer';
import { DriveType, Era, LocoFx, LocoGui } from '../common/models';
export declare class MsgLocoGuiReq extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, locoNid: number, subNid: number);
    get nid(): number;
    get subNid(): number;
}
export declare class MsgLocoGuiRsp extends Message implements LocoGui {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, locoNid: number, subId: number, version: number, flags: number, group: number, name: string, imageId: number, imageCrc: number, tachoId: number, tachoCrc: number, maxSpeedFwd: number, maxSpeedRev: number, shuntingSpeed: number, driveType: DriveType, era: Era, country: number, funImgs: number[], fxModes: number[]);
    get nid(): number;
    get subId(): number;
    get group(): number;
    get name(): string;
    get image(): number;
    get tacho(): number;
    get maxSpeedFwd(): number;
    get maxSpeedRev(): number;
    get shuntingSpeed(): number;
    get driveType(): number;
    get era(): number;
    get country(): number;
    get fx(): Array<LocoFx>;
    static fromBuffer(mode: MsgMode, nid: number, buffer: Buffer): MsgLocoGuiRsp;
    static parseEra(era: number): "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "";
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

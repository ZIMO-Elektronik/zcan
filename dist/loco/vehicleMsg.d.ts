import { Header, Message } from "../common/communication";
import { Direction, StepMax, MsgMode, OpMode, SpecialFxNr } from "../common/enums";
import { Buffer } from 'buffer';
export declare class MsgVehicleMode extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    constructor(header: Header, mode?: number[] | {
        opMode: OpMode;
        speedSteps: StepMax;
    });
    get nid(): number;
    get mode(): number[] | undefined;
    get stepMax(): StepMax | undefined;
    get opMode(): OpMode | undefined;
    static fromBuffer(mode: MsgMode, buffy: Buffer): MsgVehicleMode;
}
export declare class MsgVehicleSpeed extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    static rxDelay: () => number;
    static log: (msg: string) => void;
    private static rxTiming;
    constructor(header: Header, speedAndDirection?: number, divisor?: number, srcNid?: number);
    rxDelay(millis: number): void;
    get nid(): number;
    get srcNid(): number;
    get divisor(): number;
    get speedStep(): number;
    get direction(): boolean;
    get directionAck(): boolean;
    get forward(): boolean;
    get eastWest(): number;
    get emergencyStop(): boolean;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgVehicleSpeed;
    static speedAndDir(speed: number, forward?: boolean, emergencyStop?: boolean, eastWest?: Direction): number;
}
export declare class MsgVehicleState extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    static log: (msg: string) => void;
    constructor(header: Header, flags?: number, lastTick?: number, lastNid?: number);
    trainNid(): number;
    stateFlags(): number;
    lastCtlTick(): number;
    lastCtlNid(): number;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgVehicleState;
}
export declare class MsgVehicleLastCtl extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    static log: (msg: string) => void;
    constructor(header: Header, type: number, lastNid?: number, lastTick?: number);
    trainNid(): number;
    type(): number;
    ctlNid(): number;
    seconds(): number;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgVehicleLastCtl;
}
export declare class MsgFx extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    constructor(header: Header, fxNr: number, state?: number);
    nid(): number;
    fxNr(): number;
    state(): number | undefined;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgFx;
}
export declare class MsgFxStates extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    constructor(header: Header, state?: number);
    nid(): number;
    fx(fxNr: number): boolean | undefined;
    state(): number | undefined;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgFxStates;
}
export declare class MsgSpecialFx extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    constructor(header: Header, sfxNr: SpecialFxNr, state?: number);
    nid(): number;
    sfxNr(): number;
    state(): number | undefined;
    static fromBuffer(mode: MsgMode, buffer: Buffer): MsgSpecialFx;
}

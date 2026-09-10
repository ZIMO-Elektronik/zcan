import { Header, Message } from "../../@types/communication";
import { MaxSpeedSteps, MsgMode, OperatingMode } from "../../util/enums";
export declare class MsgVehicleMode extends Message {
    static header: (mode: MsgMode, nid: number) => {
        group: number;
        cmd: number;
        mode: MsgMode;
        nid: number;
    };
    static rxDelay: () => number;
    static log: (msg: string) => void;
    private static rxTiming;
    static modeByte1(opMode: OperatingMode, speedSteps: MaxSpeedSteps): number;
    constructor(header: Header, mode?: number[] | {
        opMode: OperatingMode;
        speedSteps: MaxSpeedSteps;
    });
    rxDelay(millis: number): void;
    trainNid(): number;
    mode(): number[] | undefined;
    speedSteps(): MaxSpeedSteps | undefined;
    operatingMode(): OperatingMode | undefined;
}

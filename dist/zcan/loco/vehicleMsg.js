import { Message } from "../../@types/communication";
import { Ranger } from "../../internal/utils";
import { MaxSpeedSteps, OperatingMode } from "../../util/enums";
export class MsgVehicleMode extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x1, mode, nid }; };
    static rxDelay = () => { return this.rxTiming.now(); };
    static log = () => { };
    static rxTiming = new Ranger({ min: 5, max: 20, now: 5 });
    static modeByte1(opMode, speedSteps) {
        const opModes = Object.values(OperatingMode);
        let rv = (speedSteps ? speedSteps : MaxSpeedSteps.UNKNOWN);
        for (let i = 0; i < opModes.length; i++)
            if (opMode === opModes[i]) {
                rv |= i << 4;
                break;
            }
        return rv;
    }
    constructor(header, mode) {
        super(header);
        if (!mode)
            return;
        if (Array.isArray(mode))
            for (let byte in mode.slice(0, 2))
                super.push({ value: byte, length: 1 });
        else {
            super.push({ value: MsgVehicleMode.modeByte1(mode.opMode, mode.speedSteps), length: 1 });
            super.push({ value: 0, length: 1 });
            super.push({ value: 0, length: 1 });
        }
    }
    rxDelay(millis) { MsgVehicleMode.rxTiming.set(millis); }
    trainNid() { return this.header.nid; }
    mode() {
        if (this.data.length < 2)
            return undefined;
        return this.data.map(data => data.value);
    }
    speedSteps() {
        if (this.data.length < 2)
            return undefined;
        const steps = this.data[0].value & 0xf;
        if (steps > 0 && steps < 6)
            return Object.values(MaxSpeedSteps)[steps];
        return MaxSpeedSteps.UNKNOWN;
    }
    operatingMode() {
        if (this.data.length < 2)
            return undefined;
        const mode = this.data[0].value >> 4;
        if (mode > 0 && mode < 8)
            return Object.values(OperatingMode)[mode];
        return OperatingMode.UNKNOWN;
    }
}
//# sourceMappingURL=vehicleMsg.js.map
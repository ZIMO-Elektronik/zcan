import { Message } from "../common/communication";
import { Ranger } from "../common/utils";
import { Direction, MsgMode } from "../common/enums";
export class MsgVehicleMode extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x1, mode, nid }; };
    constructor(header, mode) {
        super(header);
        if (!mode)
            return;
        if (Array.isArray(mode))
            for (let byte of mode.slice(0, 2)) {
                super.push({ value: byte, length: 1 });
            }
        else {
            super.push({ value: (mode.opMode << 4) | (mode.speedSteps), length: 1 });
            super.push({ value: 0, length: 1 });
            super.push({ value: 0, length: 1 });
        }
    }
    get nid() { return this.header.nid || 0; }
    get mode() {
        if (this.data.length < 2)
            return undefined;
        return this.data.map(data => data.value);
    }
    get stepMax() {
        return this.data.length < 2 ? undefined : (this.data[0].value & 0xf);
    }
    get opMode() {
        return this.data.length < 2 ? undefined : (this.data[0].value >> 4);
    }
    static fromBuffer(mode, buffy) {
        const nid = buffy.readUInt16LE(0);
        const modes = [buffy.readUInt8(2), buffy.readUInt8(3), buffy.readUInt8(4)];
        return new MsgVehicleMode(MsgVehicleMode.header(mode, nid), modes);
    }
}
export class MsgVehicleSpeed extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x2, mode, nid }; };
    static rxDelay = () => { return this.rxTiming.now(); };
    static log = () => { };
    static rxTiming = new Ranger({ min: 5, max: 20, now: 5 });
    constructor(header, speedAndDirection, divisor, srcNid) {
        super(header);
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: speedAndDirection || 0, length: 2 });
        super.push({ value: divisor || 0, length: 1 });
        super.push({ value: 0, length: 1 });
        super.push({ value: srcNid ?? 0, length: 2 });
    }
    rxDelay(millis) { MsgVehicleSpeed.rxTiming.set(millis); }
    get nid() { return this.header.nid || 0; }
    get srcNid() { return this.data[3].value; }
    get divisor() { return this.data[1].value; }
    get speedStep() { return this.data[0].value & 0x3ff; }
    get direction() { return !!(this.data[0].value & 0x400); }
    get directionAck() { return !!(this.data[0].value & 0x800); }
    get forward() { return !this.direction && !this.directionAck; }
    get eastWest() { return (this.data[0].value & 0x3000) >> 12; }
    get emergencyStop() { return !!(this.data[0].value & 0x8000); }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const speedAndDir = buffer.readUInt16LE(2);
        const divisor = buffer.readUInt8(4);
        const srcNid = buffer.readUInt16LE(6);
        const msg = new MsgVehicleSpeed(MsgVehicleSpeed.header(mode, nid), speedAndDir, divisor, srcNid);
        return msg;
    }
    static speedAndDir(speed, forward = true, emergencyStop = false, eastWest = Direction.UNDEFINED) {
        const direction = Number(!forward);
        const stop = Number(emergencyStop);
        return speed | (direction << 10) | (eastWest << 12) | (stop << 15);
    }
    ;
}
export class MsgVehicleState extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x0, mode, nid }; };
    static log = () => { };
    constructor(header, flags, lastTick, lastNid) {
        super(header);
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: flags || 0, length: 2 });
        super.push({ value: lastTick || 0, length: 2 });
        super.push({ value: lastNid || 0, length: 2 });
    }
    trainNid() { return this.header.nid || 0; }
    stateFlags() { return this.data[0].value; }
    lastCtlTick() { return this.data[1].value; }
    lastCtlNid() { return this.data[2].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const flags = buffer.readUInt16LE(2);
        const lastTick = buffer.readUInt16LE(4);
        const lastNid = buffer.readUInt16LE(6);
        const msg = new MsgVehicleState(MsgVehicleState.header(mode, nid), flags, lastTick, lastNid);
        return msg;
    }
}
export class MsgVehicleLastCtl extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x12, mode, nid }; };
    static log = () => { };
    constructor(header, type, lastNid, lastTick) {
        super(header);
        super.push({ value: type, length: 2 });
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: lastNid || 0, length: 2 });
        super.push({ value: lastTick || 0, length: 2 });
    }
    trainNid() { return this.header.nid || 0; }
    type() { return this.data[0].value; }
    ctlNid() { return this.data[1].value; }
    seconds() { return this.data[2].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const type = buffer.readUInt16LE(2);
        const ctlNid = buffer.readUInt16LE(4);
        const seconds = buffer.readUInt16LE(6);
        const msg = new MsgVehicleLastCtl(MsgVehicleLastCtl.header(mode, nid), type, ctlNid, seconds);
        return msg;
    }
}
export class MsgFx extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x4, mode, nid }; };
    constructor(header, fxNr, state) {
        super(header);
        super.push({ value: fxNr, length: 2 });
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: state || 0, length: 2 });
    }
    nid() { return this.header.nid || 0; }
    fxNr() { return this.data[0].value; }
    state() { return this.data.length < 2 ? undefined : this.data[1].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const fxNr = buffer.readUInt16LE(2);
        const state = buffer.readUInt16LE(4);
        const msg = new MsgFx(MsgFx.header(mode, nid), fxNr, state);
        return msg;
    }
}
export class MsgFxStates extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x3, mode, nid }; };
    constructor(header, state) {
        super(header);
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: state || 0, length: 2 });
    }
    nid() { return this.header.nid || 0; }
    fx(fxNr) {
        return this.data.length < 1 ? undefined : ((this.data[0].value >> fxNr) & 1) === 1;
    }
    state() { return this.data.length < 1 ? undefined : this.data[0].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const state = buffer.readUInt32LE(2);
        const msg = new MsgFxStates(MsgFxStates.header(mode, nid), state);
        return msg;
    }
}
export class MsgSpecialFx extends Message {
    static header = (mode, nid) => { return { group: 0x2, cmd: 0x5, mode, nid }; };
    constructor(header, sfxNr, state) {
        super(header);
        super.push({ value: sfxNr || 0, length: 2 });
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: state || 0, length: 2 });
    }
    nid() { return this.header.nid || 0; }
    sfxNr() { return this.data[0].value; }
    state() { return this.data.length < 2 ? undefined : this.data[1].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const sfxNr = buffer.readUInt16LE(2);
        const state = buffer.readUInt16LE(4);
        const msg = new MsgSpecialFx(MsgSpecialFx.header(mode, nid), sfxNr, state);
        return msg;
    }
}
//# sourceMappingURL=vehicleMsg.js.map
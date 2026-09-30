import { MsgMode } from "../common/enums";
import { Message } from "../common/communication";
export class MsgAccessoryMode extends Message {
    static header = (mode, nid) => { return { group: 0x1, cmd: 0x1, mode, nid }; };
    static log = () => { };
    constructor(header, mode) {
        super(header);
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: mode ?? 0, length: 2 });
    }
    get nid() { return this.header.nid || 0; }
    get mode() { return this.data[0].value; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const accMode = buffer.readUInt16LE(2);
        const msg = new MsgAccessoryMode(MsgAccessoryMode.header(mode, nid), accMode);
        return msg;
    }
}
export class MsgAccessoryPin6 extends Message {
    static TYPE_OCCUPANCY = 0x01;
    static TYPE_HLU = 0x02;
    static header = (mode, nid) => { return { group: 0x01, cmd: 0x06, mode, nid }; };
    constructor(header, pin, type, value) {
        super(header);
        super.push({ value: pin, length: 1 });
        super.push({ value: type, length: 1 });
        if (header.mode === MsgMode.REQ)
            return;
        super.push({ value: value ?? 0, length: 2 });
    }
    get nid() { return this.header.nid || 0; }
    get pin() { return this.data[0].value; }
    get type() { return this.data[1].value; }
    get state() { return this.data.length > 2 ? this.data[2].value : undefined; }
    static fromBuffer(mode, buffer) {
        const nid = buffer.readUInt16LE(0);
        const pin = buffer.readUInt8(2);
        const type = buffer.readUInt8(3);
        const value = buffer.length >= 6 ? buffer.readUInt16LE(4) : undefined;
        const msg = new MsgAccessoryPin6(MsgAccessoryPin6.header(mode, nid), pin, type, value);
        return msg;
    }
}
//# sourceMappingURL=accessoryMsg.js.map
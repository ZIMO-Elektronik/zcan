import { Message } from "../common/communication";
import { BidiType, MsgMode } from "../common/enums";
export class MsgModInfo extends Message {
    static header(mode, nid) { return { group: 0x08, cmd: 0x08, mode: mode, nid }; }
    constructor(header, type, data = []) {
        super(header);
        super.push({ value: type, length: 2 });
        if (data.length)
            this.data = this.data.concat(data);
    }
    type() { return this.data[0].value; }
    info() { return this.data.length > 1 ? this.data[1].value : undefined; }
}
export class MsgBidiInfo extends Message {
    static header(mode, nid) { return { group: 0x08, cmd: 0x05, mode: mode, nid }; }
    constructor(header, type, nid, info) {
        super(header);
        if (header.mode === MsgMode.REQ) {
            super.push({ value: nid || 0, length: 2 });
            super.push({ value: type, length: 2 });
        }
        else {
            super.push({ value: type, length: 2 });
            super.push({ value: info || 0, length: 4 });
        }
    }
    get nid() { return this.header.mode === MsgMode.REQ ? this.data[0].value : this.header.nid || 0; }
    get type() { return this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value; }
    get info() { return this.data.length > 1 ? this.data[1].value : undefined; }
    static fromBuffer(mode, buf) {
        const NID = buf.readUInt16LE(0);
        const type = buf.readUInt16LE(2);
        const info = buf.readUInt32LE(4);
        switch (type) {
            case BidiType.DIRECTION:
                return MsgBidiDir.fromBuffer(mode, buf);
            case BidiType.SPEED_REPORT:
                return MsgBidiSpeed.fromBuffer(mode, buf);
            default:
                return new MsgBidiInfo(MsgBidiInfo.header(mode, NID), type, undefined, info);
        }
    }
}
export class MsgBidiSpeed extends MsgBidiInfo {
    constructor(header, nid, info) {
        super(header, BidiType.SPEED_REPORT, nid, info);
    }
    get speed() { return this.info; }
    static fromBuffer(mode, buf) {
        const NID = buf.readUInt16LE(0);
        const type = buf.readUInt16LE(2);
        const info = buf.readUInt32LE(4);
        return new MsgBidiSpeed(MsgBidiInfo.header(mode, NID), undefined, info);
    }
}
export class MsgBidiDir extends MsgBidiInfo {
    constructor(header, nid, info) {
        super(header, BidiType.DIRECTION, nid, info);
    }
    get fwd() { return super.info === undefined ? undefined : !!(super.info & 0x01); }
    get east() { return this.info === undefined ? undefined : !!(this.info & 0x02); }
    get change() { return this.info === undefined ? undefined : !!(this.info & 0x04); }
    get confirm() { return this.info === undefined ? undefined : !!(this.info & 0x08); }
    static fromBuffer(mode, buf) {
        const nid = buf.readUInt16LE(0);
        const type = buf.readUInt16LE(2);
        const info = buf.readUInt32LE(4);
        return new MsgBidiDir(MsgBidiInfo.header(mode, nid), undefined, info);
    }
}
//# sourceMappingURL=infoMsg.js.map
import ExtendedASCII from "../common/extendedAscii";
import { Message } from "../common/communication";
import { MsgMode, NameType } from "../common/enums";
export class MsgGroupCount extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x0, mode: mode, nid: nid }; }
    constructor(header, group, count) {
        super(header);
        if (group !== undefined)
            super.push({ value: group, length: 2 });
        if (count !== undefined)
            super.push({ value: count, length: 2 });
    }
    group() { return this.data.length ? this.data[0].value : this.header.nid; }
    count() { return this.data.length > 1 ? this.data[1].value : 0; }
}
export class MsgItemsByIndexReq extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x1, mode: mode, nid: nid }; }
    constructor(header, mx10Nid, groupNid, index) {
        super(header);
        super.push({ value: groupNid, length: 2 });
        super.push({ value: index, length: 2 });
    }
}
export class MsgItemsByIndexRsp extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x1, mode: mode, nid: nid }; }
    constructor(header, index, nid, state) {
        super(header);
        super.push({ value: index, length: 2 });
        super.push({ value: nid, length: 2 });
        if (state !== undefined)
            super.push({ value: state, length: 4 });
    }
    get index() { return this.data[0].value; }
    get nid() { return this.data[1].value; }
    get state() { return this.data[2].value; }
    static fromBuffer(mode, nid, buf) {
        const index = buf.readUInt16LE(0);
        const itemNid = buf.readUInt16LE(2);
        const state = buf.readUInt32LE(4);
        return new MsgItemsByIndexRsp(MsgItemsByIndexRsp.header(mode, nid), index, itemNid, state);
    }
}
export class MsgItemsByNidReq extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x2, mode: mode, nid: nid }; }
    constructor(header, precedingNid) {
        super(header);
        super.push({ value: precedingNid, length: 2 });
    }
}
export class MsgItemsByNidRsp extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x2, mode: mode, nid: nid }; }
    constructor(header, itemNid, index, itemState, lastTick) {
        super(header);
        super.push({ value: itemNid, length: 2 });
        super.push({ value: index, length: 2 });
        super.push({ value: itemState, length: 2 });
        if (lastTick !== undefined)
            super.push({ value: lastTick, length: 2 });
    }
    itemNid() { return this.data[0].value; }
    index() { return this.data[1].value; }
    itemState() { return this.data[2].value; }
    lastTick() { return this.data[3].value; }
}
export class MsgDataName extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x21, mode: mode, nid: nid }; }
    constructor(header, subId, name, v1, v2) {
        super(header);
        super.push({ value: subId, length: 2 });
        super.push({ value: v1 || 0, length: 4 });
        super.push({ value: v2 || 0, length: 4 });
        if (header.mode === MsgMode.REQ || name === undefined)
            return;
        super.push({ value: name, length: Math.min(name.length, 32) });
        super.push({ value: 0, length: 1 });
    }
    itemNid() { return this.header.nid || 0; }
    subId() { return this.data[0].value; }
    value1() { return this.data[1].value; }
    value2() { return this.data[2].value; }
    name() { return this.data.length < 4 ? undefined : this.data[3].value; }
    type() {
        switch (this.itemNid()) {
            case 0x7f00:
                return NameType.MANUFACTURER;
            case 0x7f02:
                return NameType.DECODER;
                break;
            case 0x7f04:
                return NameType.DESIGNATION;
            case 0x7f06:
                return NameType.CFGDB;
                break;
            case 0x7f10:
                return NameType.ICON;
                break;
            case 0x7f11:
                return NameType.ICON;
                break;
            case 0x7f18:
                return NameType.ZIMO_PARTNER;
                break;
            case 0x7f20:
                return NameType.LAND;
                break;
            case 0x7f21:
                return NameType.COMPANY_CV;
                break;
            case 0xc2:
                return NameType.CONNECTION;
                break;
            default:
                if (this.subId() == 1)
                    return NameType.COMPANY_CV;
                if (this.subId() == 0)
                    return NameType.VEHICLE;
                return NameType.CONNECTION;
        }
    }
    static fromBuffer(mode, mx10Nid, buffer) {
        const nid = buffer.readUInt16LE(0);
        const subId = buffer.readUInt16LE(2);
        const v1 = buffer.readUInt32LE(4);
        const v2 = buffer.readUInt32LE(8);
        const name = ExtendedASCII.byte2str(buffer.subarray(12, 203));
        const msg = new MsgDataName(MsgDataName.header(mode, nid), subId, name, v1, v2);
        return msg;
    }
}
export class MsgItemImage extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x12, mode: mode, nid: nid }; }
    constructor(header, itemNid, imageType, imageId) {
        super(header);
        super.push({ value: itemNid, length: 2 });
        super.push({ value: imageType, length: 2 });
        if (header.mode === MsgMode.REQ || imageId === undefined)
            return;
        super.push({ value: imageId, length: 2 });
    }
    itemNid() { return (this.header.mode === MsgMode.REQ ? this.data[0].value : this.header.nid || 0); }
    imageType() { return this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value; }
    imageId() { return (this.header.mode === MsgMode.REQ ? 0 : this.data[1].value); }
}
export class MsgDataClear extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x1f, mode: mode, nid: nid }; }
    constructor(header, nidOrState) {
        super(header);
        super.push({ value: nidOrState, length: 2 });
    }
    nid() { return (this.header.mode === MsgMode.CMD ? this.data[0].value : this.header.nid || 0); }
    state() { return (this.header.mode === MsgMode.CMD ? 0 : this.data[0].value); }
}
//# sourceMappingURL=dataMsg.js.map
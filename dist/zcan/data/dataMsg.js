import { Message } from "../../@types/communication";
export class MsgItemsByIndexReq extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x1, mode: mode, nid: nid }; }
    constructor(header, mx10Nid, groupNid, index) {
        super(header);
        super.push({ value: mx10Nid, length: 2 });
        super.push({ value: groupNid, length: 2 });
        super.push({ value: index, length: 2 });
    }
}
export class MsgItemsByIndexRsp extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x1, mode: mode, nid: nid }; }
    constructor(header, index, itemNid, itemState, lastTick) {
        super(header);
        super.push({ value: index, length: 2 });
        super.push({ value: itemNid, length: 2 });
        super.push({ value: itemState, length: 2 });
        if (lastTick !== undefined)
            super.push({ value: lastTick, length: 2 });
    }
    index() { return this.data[1].value; }
    itemNid() { return this.data[2].value; }
    itemState() { return this.data[3].value; }
    lastTick() { return this.data[4].value; }
}
export class MsgItemsByNidReq extends Message {
    static header(mode, nid) { return { group: 0x7, cmd: 0x2, mode: mode, nid: nid }; }
    constructor(header, mx10Nid, precedingNid) {
        super(header);
        super.push({ value: mx10Nid, length: 2 });
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
    itemNid() { return this.data[1].value; }
    index() { return this.data[2].value; }
    itemState() { return this.data[3].value; }
    lastTick() { return this.data[4].value; }
}
//# sourceMappingURL=dataMsg.js.map
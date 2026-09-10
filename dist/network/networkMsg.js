import { Message } from "../common/communication";
import { MsgMode } from "../common/enums";
export class MsgPortOpen extends Message {
    static header(mode, nid) { return { group: 0x1a, cmd: 0x6, mode: mode, nid: nid }; }
    constructor(header, clientId, comFlags = 0xffffffff, clientName) {
        super(header);
        super.push({ value: comFlags, length: 4 });
        super.push({ value: clientId, length: 4 });
        if (clientName)
            super.push({ value: clientName, length: 20 });
    }
    comFlags() { return this.data.length ? this.data[0].value : undefined; }
    clientId() { return this.data.length > 1 ? this.data[1].value : 0; }
    clientName() { return this.data.length > 2 ? this.data[2].value : 0; }
}
export class MsgPortClose extends Message {
    static header(mode, nid) { return { group: 0xa, cmd: 0x7, mode: mode, nid: nid }; }
    constructor(header, myNid) {
        super(header);
        super.push({ value: myNid, length: 2 });
    }
}
export class MsgPing extends Message {
    static header(mode, nid) { return { group: 0xa, cmd: 0x0, mode: mode, nid: nid }; }
    constructor(header, masterUid, type, session) {
        super(header);
        if (header.mode < MsgMode.ACK)
            return;
        super.push({ value: masterUid || 0, length: 4 });
        super.push({ value: type || 0, length: 2 });
        super.push({ value: session || 0, length: 2 });
    }
    nid() { return this.header.nid; }
    masterUid() { return this.data[0].value; }
    type() { return this.data[0].value; }
    session() { return this.data[0].value; }
}
//# sourceMappingURL=networkMsg.js.map
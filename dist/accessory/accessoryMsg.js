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
//# sourceMappingURL=accessoryMsg.js.map
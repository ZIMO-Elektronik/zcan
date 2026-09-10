import { Message } from "../../@types/communication";
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
//# sourceMappingURL=infoMsg.js.map
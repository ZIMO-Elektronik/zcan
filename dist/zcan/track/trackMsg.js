import { Message } from "../../@types/communication";
export class MsgCvRead extends Message {
    static header(mode, nid) { return { group: 0x16, cmd: 0x08, mode: mode, nid: nid }; }
    constructor(header, trainNid, cvNum, cvVal = undefined) {
        super(header);
        super.push({ value: trainNid, length: 2 });
        super.push({ value: cvNum, length: 4 });
        if (cvVal !== undefined)
            super.push({ value: cvVal, length: 2 });
    }
    trainNid() { return this.data[0].value; }
    cvNum() { return this.data[1].value; }
    cvVal() { return this.data.length > 2 ? this.data[2].value : undefined; }
}
export class MsgCvWrite extends MsgCvRead {
    static header(mode, nid) { return { group: 0x16, cmd: 0x09, mode: mode, nid: nid }; }
    constructor(header, trainNid, cvNum, cvVal) {
        super(header, trainNid, cvNum, cvVal);
        this.data[2].length = 1;
    }
}
export class MsgCvWrite16 extends MsgCvRead {
    static header(mode, nid) { return { group: 0x16, cmd: 0x0d, mode: mode, nid: nid }; }
    constructor(header, trainNid, cvNum, cvVal) {
        super(header, trainNid, cvNum, cvVal);
        this.data[1].length = 2;
    }
}
//# sourceMappingURL=trackMsg.js.map
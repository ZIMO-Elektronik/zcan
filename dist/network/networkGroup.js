import { Subject } from 'rxjs';
import { Query } from '../docs_entrypoint';
import { MsgPing } from './networkMsg';
import { MsgMode } from '../common/enums';
export default class NetworkGroup {
    onPing = new Subject();
    onPortClose = new Subject();
    pingQ = undefined;
    portCloseQ = undefined;
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async ping(nid = 0xc000) {
        if (this.pingQ !== undefined && !await Query.wait(() => !!this.pingQ)) {
            this.mx10.logInfo.next("mx10.ping: failed to acquire lock");
            return undefined;
        }
        this.pingQ = new Query(MsgPing.header(nid === 0xc000 ? MsgMode.CMD : MsgMode.EVT, nid), this.onPing);
        this.pingQ.tx = ((header) => {
            const msg = new MsgPing(header);
            this.mx10.sendMsg(msg, true);
        });
        this.pingQ.match = ((msg) => {
            if (nid !== 0xc000)
                return msg.header.nid === this.mx10.mx10NID;
            return ((msg.header.nid || 0) & 0xff00) === (nid & 0xff00);
        });
        this.pingQ.subscribe(false);
        const rv = await this.pingQ.run(250);
        this.pingQ = undefined;
        return rv;
    }
    async portClose() {
        this.mx10.sendData(0x0a, 0x07, [{ value: this.mx10.myNID, length: 2 }], 0b01);
        this.mx10.mx10NID = 0;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.parsePing(size, mode, nid, buffer);
                break;
        }
    }
    parsePing(size, mode, nid, buffer) {
        if (!this.onPing.observed)
            return;
        if (mode < MsgMode.EVT) {
            const nid = buffer.readUInt16LE(0);
            this.onPing.next(new MsgPing(MsgPing.header(mode, nid)));
        }
        else {
            if (buffer.length < 8)
                return;
            const masterUid = buffer.readUInt32LE(0);
            const type = buffer.readUInt16LE(4);
            const session = buffer.readUInt16LE(6);
            this.onPing.next(new MsgPing(MsgPing.header(mode, nid), masterUid, type, session));
        }
    }
}
//# sourceMappingURL=networkGroup.js.map
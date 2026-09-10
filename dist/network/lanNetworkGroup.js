import { Query } from '../docs_entrypoint';
import { Subject } from 'rxjs';
import { MsgPortOpen } from './networkMsg';
import { MsgMode } from '../common/enums';
export default class LanNetworkGroup {
    onPortOpen = new Subject();
    portOpenQ = undefined;
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async portOpen(clientName, clientId, comFlags = 0xffffffff) {
        if (this.portOpenQ !== undefined && !await Query.wait(() => !!this.portOpenQ), 0) {
            this.mx10.logInfo.next("mx10.portOpen: failed to acquire lock");
            return undefined;
        }
        this.portOpenQ = new Query(MsgPortOpen.header(MsgMode.CMD, this.mx10.myNID), this.onPortOpen);
        this.portOpenQ.tx = ((header) => {
            const msg = new MsgPortOpen(header, clientId, comFlags, clientName);
            this.mx10.logInfo.next('portOpen query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg, true);
        });
        this.portOpenQ.match = ((msg) => {
            this.mx10.logInfo.next('portOpen query rx: ' + JSON.stringify(msg));
            return (msg.clientId() === clientId);
        });
        this.portOpenQ.subscribe(false);
        const rv = await this.portOpenQ.run();
        this.mx10.logInfo.next("mx10.portOpen.rv: " + JSON.stringify(rv));
        this.portOpenQ = undefined;
        return rv;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x06:
                this.mx10.logInfo.next('parsePortOpen, nid = ' + nid + ', buf = ' + JSON.stringify(buffer));
                this.parsePortOpen(size, mode, nid, buffer);
                break;
            case 0x0e:
                this.parseUnknownCommand(size, mode, nid, buffer);
                break;
            case 0x0f:
                this.parseCmd0f(size, mode, nid, buffer);
                break;
            default:
                this.mx10.logInfo.next('lanNetworkGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
        }
    }
    parsePortOpen(size, mode, nid, buffer) {
        if (!this.onPortOpen.observed)
            return;
        const comFlags = buffer.readUInt32LE(0);
        const clientId = buffer.readUInt32LE(4);
        this.onPortOpen.next(new MsgPortOpen(MsgPortOpen.header(mode, nid), clientId, comFlags));
    }
    parseCmd0f(size, mode, nid, buffer) {
        const chars = buffer.slice(8);
        this.mx10.logInfo.next('parseCmd0f, nid = ' + nid + ', buf = ' + String.fromCharCode(...chars));
    }
    parseUnknownCommand(size, mode, nid, buffer) {
    }
}
//# sourceMappingURL=lanNetworkGroup.js.map
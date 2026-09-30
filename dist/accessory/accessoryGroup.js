import { Subject } from 'rxjs';
import { MsgMode } from '../common/enums';
import { Query } from '../docs_entrypoint';
import { MsgAccessoryMode, MsgAccessoryPin6 } from './accessoryMsg';
export default class AccessoryGroup {
    onAccessoryMode = new Subject();
    onAccessoryPort = new Subject();
    onAccessoryPin4 = new Subject();
    onAccessoryPin6 = new Subject();
    modeQ = undefined;
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async getAccessoryMode(nid) {
        if (this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
            this.mx10.logInfo.next("mx10.getAccessoryMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgAccessoryMode.header(MsgMode.REQ, nid), this.onAccessoryMode);
        this.modeQ.tx = ((header) => {
            const msg = new MsgAccessoryMode(header);
            this.mx10.logInfo.next('accMode query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            this.mx10.logInfo.next('accMode query rx: ' + JSON.stringify(msg));
            return (msg.nid === nid);
        });
        const rv = await this.modeQ.run();
        this.mx10.logInfo.next("mx10.getAccessoryMode.rv: " + JSON.stringify(rv));
        this.modeQ = undefined;
        return rv;
    }
    async setAccessoryMode(nid, mode) {
        if (this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
            this.mx10.logInfo.next("mx10.setAccessoryMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgAccessoryMode.header(MsgMode.CMD, nid), this.onAccessoryMode);
        this.modeQ.tx = ((header) => {
            const msg = new MsgAccessoryMode(header, mode);
            this.mx10.logInfo.next('accMode query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            this.mx10.logInfo.next('accMode query rx: ' + JSON.stringify(msg));
            return (msg.nid === nid && msg.mode === mode);
        });
        const rv = await this.modeQ.run();
        this.mx10.logInfo.next("mx10.setAccessoryMode.rv: " + JSON.stringify(rv));
        this.modeQ = undefined;
        return rv;
    }
    async pin6Query(mode, nid, pin, type, value) {
        const msg = new MsgAccessoryPin6(MsgAccessoryPin6.header(mode, nid), pin, type, value);
        this.mx10.logInfo.next('accPin6 tx: ' + JSON.stringify(msg));
        const q = new Query(msg.header, this.onAccessoryPin6);
        q.tx = (() => this.mx10.sendMsg(msg));
        q.match = ((rx) => rx.pin === pin && rx.type === type && (mode === MsgMode.REQ || rx.header.mode === MsgMode.ACK));
        const rv = await q.run(10, 10);
        this.mx10.logInfo.next('accPin6 rv: ' + JSON.stringify(rv));
        return rv;
    }
    async getAccessoryPin6(nid, pin, type) {
        return this.pin6Query(MsgMode.REQ, nid, pin, type);
    }
    async setAccessoryPin6(nid, pin, type, value) {
        return this.pin6Query(MsgMode.CMD, nid, pin, type, value);
    }
    accessoryModeByNid(nid) {
        this.mx10.sendData(0x01, 0x01, [{ value: nid, length: 2 }], 0b00);
    }
    accessoryPortByNid(nid) {
        this.mx10.sendData(0x01, 0x02, [{ value: nid, length: 2 }, { value: 0, length: 2 }], 0b00);
    }
    accessoryPortByPin(nid, pin, state) {
        this.mx10.sendData(0x01, 0x04, [{ value: nid, length: 2 }, { value: pin, length: 1 }, { value: state, length: 1 }], 0b01);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x01:
                this.parseAccessoryMode(size, mode, nid, buffer);
                break;
            case 0x02:
                this.parseAccessoryPort(size, mode, nid, buffer);
                break;
            case 0x04:
                this.parseAccessoryPin4(size, mode, nid, buffer);
                break;
            case 0x06:
                this.parseAccessoryPin6(size, mode, nid, buffer);
                break;
            default:
                this.mx10.logInfo.next('accessoryCommandGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
        }
    }
    parseAccessoryMode(size, mode, nid, buffer) {
        if (this.onAccessoryMode.observed)
            this.onAccessoryMode.next(MsgAccessoryMode.fromBuffer(mode, buffer));
    }
    parseAccessoryPort(size, mode, nid, buffer) {
        if (this.onAccessoryPort.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const port = buffer.readUInt8(4);
            if (deviceNID) {
                this.onAccessoryPort.next({ nid: deviceNID, type, port });
            }
        }
    }
    parseAccessoryPin4(size, mode, nid, buffer) {
        if (this.onAccessoryPin4.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const pin = buffer.readUInt8(2);
            const state = buffer.readUInt8(3);
            if (deviceNID) {
                this.onAccessoryPin4.next({ nid: deviceNID, pin, state });
            }
        }
    }
    parseAccessoryPin6(size, mode, nid, buffer) {
        if (mode === MsgMode.REQ || buffer.length < 6)
            return;
        if (this.onAccessoryPin6.observed)
            this.onAccessoryPin6.next(MsgAccessoryPin6.fromBuffer(mode, buffer));
    }
}
//# sourceMappingURL=accessoryGroup.js.map
import { Subject } from 'rxjs';
import { MsgMode } from '../common/enums';
import { Query } from '../docs_entrypoint';
import { MsgAccessoryMode } from './accessoryMsg';
export default class AccessoryCommandGroup {
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
        if (this.modeQ !== undefined && !await this.modeQ.lock()) {
            this.mx10.logInfo.next("mx10.getAccessoryMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgAccessoryMode.header(MsgMode.REQ, nid), this.onAccessoryMode);
        this.modeQ.log = (msg) => { this.mx10.logInfo.next(msg); };
        this.modeQ.tx = ((header) => {
            const msg = new MsgAccessoryMode(header);
            this.mx10.logInfo.next('accMode query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            this.mx10.logInfo.next('accMode query rx: ' + JSON.stringify(msg));
            return (msg.nid() === nid);
        });
        const rv = await this.modeQ.run();
        this.mx10.logInfo.next("mx10.getAccessoryMode.rv: " + JSON.stringify(rv));
        this.modeQ.unlock();
        this.modeQ = undefined;
        return rv;
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
        if (this.onAccessoryPin6.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const pin = buffer.readUInt8(2);
            const type = buffer.readUInt8(3);
            const state = buffer.readUInt16LE(4);
            if (deviceNID) {
                this.onAccessoryPin6.next({ nid: deviceNID, pin, type, state });
            }
        }
    }
}
//# sourceMappingURL=accessoryCommandGroup.js.map
import { Subject } from 'rxjs';
import { Query } from '../common/communication';
import { BidiType, MsgMode } from '../common/enums';
import { MsgBidiInfo, MsgBidiSpeed, MsgModInfo } from './infoMsg';
export default class InfoGroup {
    mx10;
    onBidiDir = new Subject();
    onBidiSpeed = new Subject();
    onBidiInfo = new Subject();
    onModuleInfoChange = new Subject();
    modInfoQ = undefined;
    bidiQ = undefined;
    bidiDirQ = undefined;
    bidiSpeedQ = undefined;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async getModuleInfo(nid, type) {
        if (this.modInfoQ !== undefined && !await Query.wait(() => !!this.modInfoQ)) {
            this.mx10.logInfo.next("mx10.getModuleInfo: failed to acquire lock");
            return undefined;
        }
        this.modInfoQ = new Query(MsgModInfo.header(MsgMode.REQ, nid), this.onModuleInfoChange);
        this.modInfoQ.tx = ((header) => {
            const msg = new MsgModInfo(header, type);
            this.mx10.logInfo.next('mx10 query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modInfoQ.match = ((msg) => {
            this.mx10.logInfo.next('mx10 query rx: ' + JSON.stringify(msg));
            return (msg.type() === type);
        });
        const rv = await this.modInfoQ.run();
        this.mx10.logInfo.next("mx10.getModuleInfo.rv: " + JSON.stringify(rv));
        this.modInfoQ = undefined;
        return rv;
    }
    async getBidiDir(nid) {
        if (this.bidiDirQ !== undefined && !await Query.wait(() => !!this.bidiDirQ)) {
            this.mx10.logInfo.next("mx10.getBidiDir: failed to acquire lock");
            return undefined;
        }
        this.bidiDirQ = new Query(MsgBidiInfo.header(MsgMode.REQ, nid), this.onBidiDir);
        this.bidiDirQ.tx = ((header) => {
            const msg = new MsgBidiSpeed(header, nid);
            this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.bidiDirQ.subscribe(false);
        const rv = await this.bidiDirQ.run();
        this.mx10.logInfo.next("mx10.getBidiDir.rv: " + JSON.stringify(rv));
        this.bidiDirQ = undefined;
        return rv;
    }
    async getBidiSpeed(nid) {
        if (this.bidiSpeedQ !== undefined && !await Query.wait(() => !!this.bidiSpeedQ)) {
            this.mx10.logInfo.next("mx10.getBidiSpeed: failed to acquire lock");
            return undefined;
        }
        this.bidiSpeedQ = new Query(MsgBidiInfo.header(MsgMode.REQ, nid), this.onBidiSpeed);
        this.bidiSpeedQ.tx = ((header) => {
            const msg = new MsgBidiSpeed(header, nid);
            this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.bidiSpeedQ.subscribe(false);
        const rv = await this.bidiSpeedQ.run();
        this.mx10.logInfo.next("mx10.getBidiSpeed.rv: " + JSON.stringify(rv));
        this.bidiSpeedQ = undefined;
        return rv;
    }
    async getBidiInfo(locoNid, type) {
        if (this.bidiQ !== undefined && !await Query.wait(() => !!this.bidiQ)) {
            this.mx10.logInfo.next("mx10.getBidiInfo: failed to acquire lock");
            return undefined;
        }
        this.bidiQ = new Query(MsgBidiInfo.header(MsgMode.REQ, locoNid), this.onBidiInfo);
        this.bidiQ.tx = ((header) => {
            const msg = new MsgBidiInfo(header, type, locoNid);
            this.mx10.logInfo.next('bidi query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.bidiQ.match = ((msg) => {
            this.mx10.logInfo.next('bidi query rx: ' + JSON.stringify(msg));
            return (msg.type === type);
        });
        this.bidiQ.subscribe(false);
        const rv = await this.bidiQ.run();
        this.mx10.logInfo.next("mx10.getBidiInfo.rv: " + JSON.stringify(rv));
        this.bidiQ = undefined;
        return rv;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x05:
                this.parseBidiInfo(size, mode, nid, buffer);
                break;
            case 0x08:
                this.parseModuleInfo(size, mode, nid, buffer);
                break;
            default:
                this.mx10.logInfo.next('infoGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
        }
    }
    parseModuleInfo(size, mode, nid, buffer) {
        if (this.onModuleInfoChange.observed) {
            const NID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const info = buffer.readUInt32LE(4);
            const msg = new MsgModInfo(MsgModInfo.header(mode, NID), type, [{ value: info, length: 4 }]);
            this.onModuleInfoChange.next(msg);
        }
    }
    parseBidiInfo(size, mode, nid, buffer) {
        const NID = buffer.readUInt16LE(0);
        const type = buffer.readUInt16LE(2);
        const info = buffer.readUInt32LE(4);
        const msg = MsgBidiInfo.fromBuffer(mode, buffer);
        switch (type) {
            case BidiType.DIRECTION:
                this.onBidiDir.next(msg);
                break;
            case BidiType.SPEED_REPORT:
                this.onBidiSpeed.next(msg);
                break;
            default:
                this.onBidiInfo.next(msg);
                break;
        }
    }
}
//# sourceMappingURL=infoGroup.js.map
import { Subject } from 'rxjs';
import { Query } from '../../@types/communication';
import { BidiType, Direction, ForwardOrReverse, MsgMode } from '../../util/enums';
import { MsgModInfo } from './infoMsg';
export default class InfoGroup {
    mx10;
    onBidiInfoChange = new Subject();
    onModuleInfoChange = new Subject();
    modInfoQ = undefined;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async getModuleInfo(nid, type) {
        if (this.modInfoQ !== undefined && !await this.modInfoQ.lock()) {
            this.mx10.log.next("mx10.getModuleInfo: failed to acquire lock");
            return undefined;
        }
        this.modInfoQ = new Query(MsgModInfo.header(MsgMode.REQ, nid), this.onModuleInfoChange);
        this.modInfoQ.log = ((msg) => {
            this.mx10.log.next(msg);
        });
        this.modInfoQ.tx = ((header) => {
            const msg = new MsgModInfo(header, type);
            this.mx10.log.next('mx10 query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modInfoQ.match = ((msg) => {
            this.mx10.log.next('mx10 query rx: ' + JSON.stringify(msg));
            return (msg.type() === type);
        });
        const rv = await this.modInfoQ.run();
        this.mx10.log.next("mx10.getModuleInfo.rv: " + JSON.stringify(rv));
        this.modInfoQ.unlock();
        this.modInfoQ = undefined;
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
                console.log('command not parsed: ' + command.toString());
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
        if (this.onBidiInfoChange.observed) {
            const NID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const info = buffer.readUInt32LE(4);
            let data = {};
            switch (type) {
                case BidiType.DIRECTION:
                    data.direction = this.parseEastWest(info);
                    data.directionChange = this.parseDirChange(info);
                    data.directionConfirm = this.parseDirectionConfirm(info);
                    data.forwardOrReverse = this.parseFwdRev(info);
                    break;
                default:
                    data = info;
            }
            this.onBidiInfoChange.next({
                nid: NID,
                type,
                data,
            });
        }
    }
    parseEastWest(data) {
        if ((data & 0x02) == 0x02) {
            return Direction.EAST;
        }
        else {
            return Direction.WEST;
        }
    }
    parseDirChange(data) {
        return (data & 0x04) == 0x04;
    }
    parseFwdRev(data) {
        if ((data & 0x01) == 0) {
            return ForwardOrReverse.REVERSE;
        }
        else {
            return ForwardOrReverse.FORWARD;
        }
    }
    parseDirectionConfirm(data) {
        return (data & 0x08) == 0x08;
    }
}
//# sourceMappingURL=infoGroup.js.map
import { Subject } from 'rxjs';
import { AccessoryMode } from '../util/enums';
export default class AccessoryCommandGroup {
    onAccessoryMode = new Subject();
    onAccessoryPort = new Subject();
    onAccessoryPin = new Subject();
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    accessoryModeByNid(nid) {
        this.mx10.sendData(0x01, 0x01, [{ value: nid, length: 2 }], 0b00);
    }
    accessoryPortByNid(nid) {
        this.mx10.sendData(0x01, 0x02, [
            { value: nid, length: 2 },
            { value: 0, length: 2 },
        ], 0b00);
    }
    accessoryPortByPin(nid, pin, state) {
        this.mx10.sendData(0x01, 0x04, [
            { value: nid, length: 2 },
            { value: pin, length: 1 },
            { value: state, length: 1 },
        ], 0b01);
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
                this.parseAccessoryPin(size, mode, nid, buffer);
                break;
            default:
                console.warn('command not parsed: ' + command.toString());
        }
    }
    parseAccessoryMode(size, mode, nid, buffer) {
        if (this.onAccessoryMode.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const mode = buffer.readUInt16LE(2);
            let parsedMode;
            switch (mode) {
                case 1:
                    parsedMode = AccessoryMode.PAIRED;
                    break;
                case 2:
                    parsedMode = AccessoryMode.SINGLE;
                    break;
                default:
                    parsedMode = AccessoryMode.UNKNOWN;
            }
            if (deviceNID) {
                this.onAccessoryMode.next({
                    nid: deviceNID,
                    mode: parsedMode,
                });
            }
        }
    }
    parseAccessoryPort(size, mode, nid, buffer) {
        if (this.onAccessoryPort.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const port = buffer.readUInt8(4);
            if (deviceNID) {
                this.onAccessoryPort.next({
                    nid: deviceNID,
                    type,
                    port,
                });
            }
        }
    }
    parseAccessoryPin(size, mode, nid, buffer) {
        if (this.onAccessoryPin.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const pin = buffer.readUInt8(2);
            const state = buffer.readUInt8(3);
            if (deviceNID) {
                this.onAccessoryPin.next({
                    nid: deviceNID,
                    pin,
                    state,
                });
            }
        }
    }
}
//# sourceMappingURL=accessoryCommandGroup.js.map
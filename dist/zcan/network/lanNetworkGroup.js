import { Subject } from 'rxjs';
export default class LanNetworkGroup {
    mx10;
    onPortOpen = new Subject();
    constructor(mx10) {
        this.mx10 = mx10;
    }
    portOpen() {
        this.mx10.sendData(0x1a, 0x06, [
            { value: 4294967295, length: 4 },
            { value: 1514238064, length: 4 },
            { value: 'ZIMO APP', length: 20 },
        ], 0b01, this.mx10.myNID, true);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x06:
                this.parsePortOpen(size, mode, nid, buffer);
                break;
            case 0x0e:
                this.parseUnknownCommand(size, mode, nid, buffer);
                break;
            default:
                console.warn('command not parsed: ' + command.toString());
        }
    }
    parsePortOpen(size, mode, nid, buffer) {
        if (this.onPortOpen.observed) {
            this.mx10.mx10NID = nid;
            this.mx10.connected = true;
            this.onPortOpen.next(true);
        }
    }
    parseUnknownCommand(size, mode, nid, buffer) {
    }
}
//# sourceMappingURL=lanNetworkGroup.js.map
import { Subject } from 'rxjs';
export default class SystemControlGroup {
    mx10;
    onSystemStateChange = new Subject();
    constructor(mx10) {
        this.mx10 = mx10;
    }
    systemState(mode, port = 0xff, device = this.mx10.mx10NID) {
        this.mx10.sendData(0x00, 0x00, [
            { value: device, length: 2 },
            { value: port, length: 1 },
            { value: mode, length: 1 },
        ]);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.parseSystemState(size, mode, nid, buffer);
                break;
        }
    }
    parseSystemState(size, mode, nid, buffer) {
        if (this.onSystemStateChange.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const port = buffer.readUInt8(2);
            const modeState = buffer.readUInt8(3);
            this.onSystemStateChange.next({
                nid: deviceNID,
                port,
                mode: modeState,
            });
        }
    }
}
//# sourceMappingURL=systemControlGroup.js.map
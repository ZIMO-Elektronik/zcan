import { Subject } from 'rxjs';
import { TrackMode } from '../util/enums';
export default class LanInfoGroup {
    mx10;
    onModulePowerInfo = new Subject();
    constructor(mx10) {
        this.mx10 = mx10;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.parseModulePowerInfo(size, mode, nid, buffer);
                break;
        }
    }
    parseModulePowerInfo(size, mode, nid, buffer) {
        if (this.onModulePowerInfo.observed) {
            const deviceNID = buffer.readUInt16LE(0);
            const port1 = buffer.readUInt16LE(2);
            const port1Voltage = buffer.readUInt16LE(4);
            const port1Amperage = buffer.readUInt16LE(6);
            const port2 = buffer.readUInt16LE(8);
            const port2Voltage = buffer.readUInt16LE(10);
            const port2Amperage = buffer.readUInt16LE(12);
            const amperage32V = buffer.readUInt16LE(14);
            const amperage12V = buffer.readUInt16LE(16);
            const voltageTotal = buffer.readUInt16LE(18);
            const temperature = buffer.readUInt16LE(20);
            const port1Status = this.parsePortStatus(port1);
            const port2Status = this.parsePortStatus(port2);
            this.onModulePowerInfo.next({
                deviceNID,
                port1Status,
                port1Voltage,
                port1Amperage,
                port2Status,
                port2Voltage,
                port2Amperage,
                amperage32V,
                amperage12V,
                voltageTotal,
                temperature,
            });
        }
    }
    parsePortStatus(state) {
        const offBites = 0b0000000000001;
        const off = (state & offBites) === 1;
        const tmp = (state >> 4) & 0x0f;
        if (off) {
            return TrackMode.OFF;
        }
        else {
            return tmp;
        }
    }
}
//# sourceMappingURL=lanInfoGroup.js.map
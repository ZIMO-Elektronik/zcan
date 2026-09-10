import { Subject } from 'rxjs';
export default class LanLocoStateGroup {
    mx10;
    onLocoStateExtended = new Subject();
    constructor(mx10) {
        this.mx10 = mx10;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.parseLocoStateExtended(size, mode, nid, buffer);
                break;
        }
    }
    parseLocoStateExtended(size, mode, nid, buffer) {
        if (this.onLocoStateExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const ownerNid = buffer.readUInt16LE(4);
            const trainNid = buffer.readUInt16LE(6);
            const lastControlledTime = buffer.readUInt32LE(8);
            const railComData = buffer.readUInt32LE(12);
            const partOneFunctions = buffer.readUInt32LE(16);
            const partTwoFunctions = buffer.readUInt32LE(20);
            let functions = partTwoFunctions * 2 ** 32 + partOneFunctions;
            const functionsStates = [];
            for (let i = 0; i < 63; i++) {
                const active = (functions & 1) === 1;
                functions >>>= 1;
                functionsStates.push(active);
            }
            const sentDCCData = buffer.readUInt32LE(24);
            const receivedRailcomData = buffer.readUInt32LE(28);
            this.onLocoStateExtended.next({
                nid: NID,
                type,
                ownerNid,
                trainNid,
                lastControlledTime,
                railComData,
                functionsStates,
                sentDCCData,
                receivedRailcomData,
            });
        }
    }
}
//# sourceMappingURL=lanLocoStateGroup.js.map
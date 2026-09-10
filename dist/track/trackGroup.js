import { Subject } from 'rxjs';
import { Query } from '../common/communication';
import { MsgMode } from '../common/enums';
import { MsgCvRead, MsgCvWrite, MsgCvWrite16 } from './trackMsg';
export default class TrackCfgGroup {
    onTseInfoExtended = new Subject();
    onTseProgReadExtended = new Subject();
    onTseProgWriteExtended = new Subject();
    onTseProgWrite16Extended = new Subject();
    getCvQ = undefined;
    setCvQ = undefined;
    subTseInfo = undefined;
    mx10;
    constructor(mx10) { this.mx10 = mx10; }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x02:
                this.parseTseInfo(size, mode, nid, buffer);
                break;
            case 0x08:
                this.parseTseProgRead(size, mode, nid, buffer);
                break;
            case 0x09:
                this.parseTseProgWrite(size, mode, nid, buffer);
                break;
            case 0x0d:
                this.parseTseProgWrite16(size, mode, nid, buffer);
                break;
        }
    }
    parseTseInfo(size, mode, nid, buffer) {
        if (this.onTseInfoExtended.observed) {
            const NID = buffer.readUInt16LE(2);
            const cfgNum = buffer.readUInt32LE(4);
            const cvState = buffer.readUInt8(8);
            const cvCode = buffer.readUInt8(9);
            this.onTseInfoExtended.next({
                nid: NID,
                cfgNum,
                cvState,
                cvCode,
            });
        }
    }
    parseTseProgRead(size, mode, nid, buffer) {
        if (!this.onTseProgReadExtended.observed)
            return;
        const NID = buffer.readUInt16LE(2);
        const cfgNum = buffer.readUInt32LE(4);
        const cvValue = buffer.readUInt16LE(8);
        this.onTseProgReadExtended.next(new MsgCvRead(MsgCvRead.header(mode, nid), NID, cfgNum, cvValue));
    }
    parseTseProgWrite(size, mode, nid, buffer) {
        if (!this.onTseProgWriteExtended.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const cfgNum = buffer.readUInt32LE(2);
        const cvValue = buffer.readUInt8(6);
        this.mx10.logInfo.next("parseTseProgWrite: mode=" + mode + " ... " + JSON.stringify(buffer));
        this.onTseProgWriteExtended.next(new MsgCvWrite(MsgCvWrite.header(mode, nid), NID, cfgNum, cvValue));
    }
    parseTseProgWrite16(size, mode, nid, buffer) {
        if (!this.onTseProgWrite16Extended.observed)
            return;
        if (buffer.length < 6)
            throw new Error('parseTseProgWrite16 rx: ' + JSON.stringify(buffer));
        const NID = buffer.readUInt16LE(0);
        const cfgNum = buffer.readUInt16LE(2);
        const cvValue = buffer.readUInt16LE(4);
        this.onTseProgWrite16Extended.next(new MsgCvWrite16(MsgCvWrite16.header(mode, nid), NID, cfgNum, cvValue));
    }
    tseProgRead(NID, CV) {
        this.mx10.sendData(0x16, 0x08, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: CV, length: 4 },
        ]);
    }
    tseProgWrite(NID, CV, value) {
        this.mx10.sendData(0x16, 0x09, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: CV, length: 4 },
            { value: value, length: 1 },
        ]);
    }
    tseProgWrite16(NID, CV, value) {
        this.mx10.sendData(0x16, 0x0d, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: CV, length: 2 },
            { value: value, length: 2 },
        ]);
    }
    tseProgWriteBit(nid, cv, bit, val) {
        this.mx10.logInfo.next('mx10.tseProgWriteBit @ ' + nid + ', cv #' + cv + '.' + bit + ' = ' + val);
        this.mx10.sendData(0x16, 0x06, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: nid, length: 2 },
            { value: cv, length: 4 },
            { value: bit, length: 1 },
            { value: val, length: 1 },
        ]);
    }
    async getCv(nid, cvNum) {
        if (this.getCvQ !== undefined && !await Query.wait(() => !!this.getCvQ)) {
            this.mx10.logInfo.next("mx10.getCv: failed to acquire lock");
            return undefined;
        }
        this.getCvQ = new Query(MsgCvRead.header(MsgMode.CMD, this.mx10.mx10NID), this.onTseProgReadExtended);
        this.getCvQ.tx = ((header) => {
            const msg = new MsgCvRead(header, nid, cvNum);
            this.mx10.logInfo.next('cv query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.getCvQ.match = ((msg) => {
            this.mx10.logInfo.next('cv query rx: ' + JSON.stringify(msg));
            return (msg.nid === nid && msg.cvNum === cvNum);
        });
        this.subTseInfo = this.onTseInfoExtended.subscribe(msg => {
            this.mx10.logInfo.next('cv info: ' + JSON.stringify(msg));
            if (!this.getCvQ) {
                if (this.subTseInfo)
                    this.subTseInfo.unsubscribe();
                return;
            }
            this.mx10.logInfo.next('cv info.: ' + JSON.stringify(msg));
            if (msg.nid !== nid || msg.cfgNum !== cvNum)
                return;
            this.mx10.logInfo.next('cv info matches.. ' + JSON.stringify(msg));
            if (this.subTseInfo)
                this.subTseInfo.unsubscribe();
            if (msg.cvState === 0x10) {
                this.mx10.logInfo.next('cv info mute ' + JSON.stringify(msg));
                this.getCvQ.mute = true;
            }
            else if (msg.cvState >= 0xf0) {
                this.mx10.logInfo.next('cv info is error' + JSON.stringify(msg));
                this.getCvQ.abort = true;
            }
        });
        const rv = await this.getCvQ.run(50, 50);
        this.mx10.logInfo.next("mx10.getCv.rv: " + JSON.stringify(rv));
        this.getCvQ = undefined;
        return rv;
    }
    async setCv(trainNid, cvNum, cvVal, retries = 5) {
        if (this.setCvQ !== undefined && !await Query.wait(() => !!this.setCvQ)) {
            this.mx10.logInfo.next("mx10.setCv: failed to acquire lock");
            return undefined;
        }
        this.setCvQ = new Query(MsgCvWrite.header(MsgMode.CMD, this.mx10.mx10NID), this.onTseProgWriteExtended);
        this.setCvQ.tx = ((header) => {
            const msg = new MsgCvWrite(header, trainNid, cvNum, cvVal);
            this.mx10.sendMsg(msg);
        });
        this.setCvQ.match = ((msg) => {
            return (msg.nid === trainNid && msg.cvNum === cvNum && msg.cvVal === cvVal);
        });
        const rv = await this.setCvQ.run(150, Math.min(1, retries));
        this.mx10.logInfo.next("mx10.setCv.rv: " + JSON.stringify(rv));
        this.setCvQ = undefined;
        return rv;
    }
    async setCv16(trainNid, cvNum, cvVal, retries = 1) {
        if (this.setCvQ !== undefined && !await Query.wait(() => !!this.setCvQ)) {
            this.mx10.logInfo.next("mx10.setCv: failed to acquire lock");
            return undefined;
        }
        this.setCvQ = new Query(MsgCvWrite16.header(MsgMode.CMD, this.mx10.mx10NID), this.onTseProgWrite16Extended);
        this.setCvQ.tx = ((header) => {
            const msg = new MsgCvWrite16(header, trainNid, cvNum, cvVal);
            this.mx10.sendMsg(msg);
        });
        this.setCvQ.match = ((msg) => {
            return (msg.nid === trainNid && msg.cvNum === cvNum && msg.cvVal === cvVal);
        });
        const rv = await this.setCvQ.run(150, retries);
        this.mx10.logInfo.next("mx10.setCv.rv: " + JSON.stringify(rv));
        this.setCvQ = undefined;
        return rv;
    }
}
//# sourceMappingURL=trackGroup.js.map
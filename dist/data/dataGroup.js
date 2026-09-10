import { Subject } from 'rxjs';
import { MsgMode } from '../common/enums';
import { MsgDataClear, MsgDataName, MsgGroupCount, MsgItemImage, MsgItemsByIndexReq, MsgItemsByIndexRsp, MsgItemsByNidReq, MsgItemsByNidRsp } from './dataMsg';
import { Query } from '../docs_entrypoint';
export default class DataGroup {
    onGroupCount = new Subject();
    onListItemsByIndex = new Subject();
    onListItemsByNid = new Subject();
    onClear = new Subject();
    onItemImageConfig = new Subject();
    onItemFxMode = new Subject();
    onItemFxConfig = new Subject();
    onDataNameExtended = new Subject();
    nameQ = undefined;
    imageQ = undefined;
    groupCountQ = undefined;
    byIndexQ = undefined;
    byNidQ = undefined;
    clearQ = undefined;
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    async groupCount(groupNid = 0) {
        if (this.groupCountQ !== undefined && !await Query.wait(() => !!this.groupCountQ)) {
            this.mx10.logInfo.next("mx10.groupCount: failed to acquire lock");
            return undefined;
        }
        this.groupCountQ = new Query(MsgGroupCount.header(MsgMode.REQ, this.mx10.mx10NID), this.onGroupCount);
        this.groupCountQ.tx = ((header) => {
            const msg = new MsgGroupCount(header, groupNid);
            this.mx10.sendMsg(msg);
        });
        this.groupCountQ.match = ((msg) => {
            return (msg.group() === groupNid);
        });
        const rv = await this.groupCountQ.run();
        this.groupCountQ = undefined;
        return rv;
    }
    async listItemsByIndex(groupNid, index) {
        if (this.byIndexQ !== undefined && !await Query.wait(() => !!this.byIndexQ)) {
            this.mx10.logInfo.next("mx10.listItemsByIndex: failed to acquire lock");
            return undefined;
        }
        this.byIndexQ = new Query(MsgItemsByIndexReq.header(MsgMode.REQ, this.mx10.mx10NID), this.onListItemsByIndex);
        this.byIndexQ.tx = ((header) => {
            const msg = new MsgItemsByIndexReq(header, this.mx10.myNID, groupNid, index);
            this.mx10.sendMsg(msg);
        });
        this.byIndexQ.match = ((msg) => {
            const nid = msg.nid;
            switch (groupNid) {
                case 0:
                    return nid < 0x2800;
                case 0x2800:
                    return nid < 0x28ff;
                case 0x2f00:
                    return nid < 0x3000;
                case 0x3000:
                    return nid < 0x3200;
                case 0x3200:
                    return nid < 0x3a00;
                case 0x3a00:
                    return nid < 0x3e00;
                case 0x4000:
                    return nid < 0x4400;
                case 0x4400:
                    return nid < 0x4600;
                case 0x4600:
                    return nid < 0x4800;
                case 0x5000:
                    return nid < 0x5040;
                case 0x5040:
                    return nid < 0x5080;
                case 0x5080:
                    return nid < 0x50c0;
                case 0x50c0:
                    return nid < 0x50d0;
                case 0x50d0:
                    return nid < 0x50e0;
                case 0x5100:
                    return nid < 0x5140;
                case 0x5140:
                    return nid < 0x5180;
                case 0x5800:
                    return nid < 0x5880;
                case 0x5a00:
                    return nid < 0x5b00;
                case 0x6000:
                    return nid < 0x6100;
                case 0x6100:
                    return nid < 0x6400;
                case 0x6600:
                    return nid < 0x6700;
                case 0x8000:
                    return nid < 0xc000;
                case 0xc000:
                    return nid < 0xc100;
                case 0xc100:
                    return nid < 0xc200;
                case 0xc200:
                    return nid < 0xc300;
                case 0xc300:
                    return nid < 0xc400;
                case 0xc400:
                    return nid < 0xc500;
                case 0xd000:
                    return nid < 0xe000;
                case 0xe000:
                    return nid < 0xf000;
                case 0xf000:
                    return nid <= 0xffff;
            }
            return false;
        });
        const rv = await this.byIndexQ.run();
        this.mx10.logInfo.next("mx10.listItemsByIndex.rv: " + JSON.stringify(rv));
        this.byIndexQ = undefined;
        return rv;
    }
    async listItemsByNid(previousNid) {
        if (this.byNidQ !== undefined && !await Query.wait(() => !!this.byNidQ)) {
            this.mx10.logInfo.next("mx10.listItemsByNid: failed to acquire lock");
            return undefined;
        }
        this.byNidQ = new Query(MsgItemsByNidReq.header(MsgMode.REQ, this.mx10.mx10NID), this.onListItemsByNid);
        this.byNidQ.tx = ((header) => {
            const msg = new MsgItemsByNidReq(header, previousNid);
            this.mx10.logInfo.next('listItemsByNid query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        const rv = await this.byNidQ.run();
        this.mx10.logInfo.next("mx10.listItemsByNid.rv: " + JSON.stringify(rv));
        this.byNidQ = undefined;
        return rv;
    }
    async clear(nid) {
        if (this.clearQ !== undefined && !await Query.wait(() => !!this.clearQ)) {
            this.mx10.logInfo.next("mx10.dataClear: failed to acquire lock");
            return undefined;
        }
        this.clearQ = new Query(MsgDataClear.header(MsgMode.CMD, this.mx10.mx10NID), this.onClear);
        this.clearQ.tx = ((header) => {
            const msg = new MsgDataClear(header, nid);
            this.mx10.logInfo.next('dataClear query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.clearQ.match = ((msg) => {
            return msg.nid() === msg.nid();
        });
        this.clearQ.subscribe(false);
        const rv = await this.clearQ.run();
        this.mx10.logInfo.next("mx10.dataClear.rv: " + JSON.stringify(rv));
        this.clearQ = undefined;
        return rv;
    }
    itemImageConfig(nid, type, imageId) {
        this.mx10.sendData(0x07, 0x12, [
            { value: nid, length: 2 },
            { value: type, length: 2 },
            { value: imageId, length: 2 },
        ]);
    }
    itemFxModes(nid, group, mode) {
        this.mx10.sendData(0x07, 0x14, [
            { value: nid, length: 2 },
            { value: group, length: 1 },
            { value: 0, length: 1 },
            { value: mode[0] | (mode[1] << 2) | (mode[2] << 4) | (mode[3] << 6), length: 1 },
            { value: mode[4] | (mode[5] << 2) | (mode[6] << 4) | (mode[7] << 6), length: 1 },
            { value: mode[8] | (mode[9] << 2) | (mode[10] << 4) | (mode[11] << 6), length: 1 },
            { value: mode[12] | (mode[13] << 2) | (mode[14] << 4) | (mode[15] << 6), length: 1 },
        ]);
    }
    itemFxConfig(nid, fx, type, data) {
        this.mx10.sendData(0x07, 0x15, [
            { value: nid, length: 2 },
            { value: fx, length: 2 },
            { value: type, length: 2 },
            { value: data, length: 2 },
        ]);
    }
    async getName(nid, subId) {
        if (this.nameQ !== undefined && !await Query.wait(() => !!this.nameQ)) {
            this.mx10.logInfo.next("mx10.getName: failed to acquire lock");
            return undefined;
        }
        this.nameQ = new Query(MsgDataName.header(MsgMode.REQ, this.mx10.mx10NID), this.onDataNameExtended);
        this.nameQ.tx = ((header) => {
            const msg = new MsgDataName(header, subId);
            this.mx10.sendMsg(msg);
        });
        this.nameQ.match = ((msg) => {
            return (msg.itemNid() === nid && msg.subId() === subId);
        });
        const rv = await this.nameQ.run();
        this.nameQ = undefined;
        return rv;
    }
    async setName(nid, subId, name) {
        if (this.nameQ !== undefined && !await Query.wait(() => !!this.nameQ)) {
            this.mx10.logInfo.next("mx10.setName: failed to acquire lock");
            return undefined;
        }
        this.nameQ = new Query(MsgDataName.header(MsgMode.CMD, nid), this.onDataNameExtended);
        this.nameQ.tx = ((header) => {
            const msg = new MsgDataName(header, subId, name);
            this.mx10.sendMsg(msg);
        });
        this.nameQ.match = ((msg) => {
            return (msg.itemNid() === nid && msg.subId() === subId);
        });
        this.nameQ.subscribe(false);
        const rv = await this.nameQ.run();
        this.nameQ = undefined;
        return rv;
    }
    async getImage(nid, type) {
        if (this.imageQ !== undefined && !await Query.wait(() => !!this.imageQ)) {
            this.mx10.logInfo.next("mx10.getImage: failed to acquire lock");
            return undefined;
        }
        this.imageQ = new Query(MsgItemImage.header(MsgMode.REQ, this.mx10.mx10NID), this.onItemImageConfig);
        this.imageQ.tx = ((header) => {
            const msg = new MsgItemImage(header, nid, type);
            this.mx10.sendMsg(msg);
        });
        this.imageQ.match = ((msg) => {
            return (msg.itemNid() === nid && msg.imageType() === type);
        });
        const rv = await this.imageQ.run();
        this.imageQ = undefined;
        return rv;
    }
    async setImage(nid, type, id) {
        if (this.imageQ !== undefined && !await Query.wait(() => !!this.imageQ)) {
            this.mx10.logInfo.next("mx10.setImage: failed to acquire lock");
            return undefined;
        }
        this.imageQ = new Query(MsgItemImage.header(MsgMode.CMD, nid), this.onItemImageConfig);
        this.imageQ.tx = ((header) => {
            const msg = new MsgItemImage(header, nid, type, id);
            this.mx10.sendMsg(msg);
        });
        this.imageQ.match = ((msg) => {
            return (msg.itemNid() === nid && msg.imageType() === type);
        });
        this.imageQ.subscribe(false);
        const rv = await this.imageQ.run();
        this.imageQ = undefined;
        return rv;
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.parseGroupCount(size, mode, nid, buffer);
                break;
            case 0x01:
                this.parseItemListByIndex(size, mode, nid, buffer);
                break;
            case 0x02:
                this.mx10.logInfo.next('parseItemListByNid: ' + JSON.stringify(buffer));
                this.parseItemListByNid(size, mode, nid, buffer);
                break;
            case 0x12:
                this.parseItemImageConfig(size, mode, nid, buffer);
                break;
            case 0x14:
                this.parseItemFxMode(size, mode, nid, buffer);
                break;
            case 0x15:
                this.parseItemFxConfig(size, mode, nid, buffer);
                break;
            case 0x1f:
                this.parseDataClear(size, mode, nid, buffer);
                break;
            case 0x21:
                this.parseDataNameExtended(size, mode, nid, buffer);
                break;
            default:
                this.mx10.logInfo.next('dataGroup command ' + command + ' not parsed: ' + JSON.stringify(buffer));
        }
    }
    parseGroupCount(size, mode, nid, buffer) {
        if (!this.onGroupCount.observed)
            return;
        const group = buffer.readUInt16LE(0);
        const count = buffer.readUInt16LE(2);
        this.onGroupCount.next(new MsgGroupCount(MsgGroupCount.header(mode, nid), group, count));
    }
    parseItemListByIndex(size, mode, nid, buffer) {
        if (!this.onListItemsByIndex.observed)
            return;
        this.onListItemsByIndex.next(MsgItemsByIndexRsp.fromBuffer(mode, nid, buffer));
    }
    parseItemListByNid(size, mode, nid, buffer) {
        if (!this.onListItemsByNid.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const index = buffer.readUInt16LE(2);
        const itemState = buffer.readUInt16LE(4);
        const lastTick = buffer.readUInt16LE(6);
        const msg = new MsgItemsByNidRsp(MsgItemsByNidRsp.header(mode, nid), NID, index, itemState, lastTick);
        this.onListItemsByNid.next(msg);
    }
    parseDataClear(size, mode, nid, buffer) {
        if (!this.onClear.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const state = buffer.readUInt16LE(2);
        const msg = new MsgDataClear(MsgDataClear.header(mode, NID), state);
        this.onClear.next(msg);
    }
    parseItemImageConfig(size, mode, nid, buffer) {
        if (!this.onItemImageConfig.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const type = buffer.readUInt16LE(2);
        const imageId = buffer.readUInt16LE(4);
        this.onItemImageConfig.next(new MsgItemImage(MsgItemImage.header(mode, nid), NID, type, imageId));
    }
    parseItemFxMode(size, mode, nid, buffer) {
        if (!this.onItemFxMode.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const group = buffer.readUInt8(2);
        const fxModes = buffer.readUInt32LE(4);
        const fxMode = [];
        for (let i = 0; i < 32; i += 2)
            fxMode.push((fxModes >> i) & 0b11);
        const msg = { nid: NID, group, mode: fxMode };
        this.mx10.logInfo.next('parseItemFxMode: ' + JSON.stringify(msg));
        this.onItemFxMode.next(msg);
    }
    parseItemFxConfig(size, mode, nid, buffer) {
        if (!this.onItemFxConfig.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const fx = buffer.readUInt16LE(2);
        const item = buffer.readUInt16LE(4);
        const data = buffer.readUInt16LE(6);
        const msg = { nid: NID, function: fx, item, data };
        this.mx10.logInfo.next('parseItemFxConfig: ' + JSON.stringify(msg));
        this.onItemFxConfig.next(msg);
    }
    parseDataNameExtended(size, mode, nid, buffer) {
        if (!this.onDataNameExtended.observed)
            return;
        this.mx10.logInfo.next('parseDataNameExtended: ' + nid + ', ' + JSON.stringify(buffer));
        const msg = MsgDataName.fromBuffer(mode, nid, buffer);
        this.onDataNameExtended.next(msg);
        return;
    }
}
//# sourceMappingURL=dataGroup.js.map
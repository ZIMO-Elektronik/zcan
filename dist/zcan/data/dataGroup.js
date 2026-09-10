import { Subject } from 'rxjs';
import { NameType } from '../../util/enums';
import ExtendedASCII from '../../util/extended-ascii';
export default class DataGroup {
    onGroupCount = new Subject();
    onListItemsByIndex = new Subject();
    onListItemsByNID = new Subject();
    onRemoveLocomotive = new Subject();
    onItemImageConfig = new Subject();
    onItemFxMode = new Subject();
    onItemFxConfig = new Subject();
    onDataNameExtended = new Subject();
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    groupCount(objType = 0x0000) {
        this.mx10.sendData(0x07, 0x00, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: objType, length: 2 },
        ], 0b00);
    }
    listItemsByIndex(groupNID, index) {
        this.mx10.sendData(0x07, 0x01, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: groupNID, length: 2 },
            { value: index, length: 2 },
        ], 0b00);
    }
    listItemsByNID(searchAfterValue) {
        this.mx10.sendData(0x07, 0x02, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: searchAfterValue, length: 2 },
        ], 0b00);
    }
    removeLocomotive(toRemove, removeFrom = this.mx10.mx10NID) {
        this.mx10.sendData(0x07, 0x1f, [
            { value: removeFrom, length: 2 },
            { value: toRemove, length: 2 },
        ]);
    }
    itemImageConfig(nid, type, imageId) {
        this.mx10.sendData(0x07, 0x12, [
            { value: nid, length: 2 },
            { value: type, length: 2 },
            { value: imageId, length: 2 },
        ]);
    }
    itemFxMode(nid, group, mode) {
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
    itemFxConfig(nid, fx, item, data) {
        this.mx10.sendData(0x07, 0x15, [
            { value: nid, length: 2 },
            { value: fx, length: 2 },
            { value: item, length: 2 },
            { value: data, length: 2 },
        ]);
    }
    dataNameExtended(NID, subID, name) {
        this.mx10.sendData(0x07, 0x21, [
            { value: NID, length: 2 },
            { value: subID, length: 2 },
            { value: 0, length: 4 },
            { value: 0, length: 4 },
            { value: name, length: name.length },
            { value: 0, length: 1 },
        ], 0b01);
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
                console.warn('command not parsed: ' + command.toString());
        }
    }
    parseGroupCount(size, mode, nid, buffer) {
        if (this.onGroupCount.observed) {
            const objectType = buffer.readUInt16LE(0);
            const number = buffer.readUInt16LE(2);
            this.onGroupCount.next({
                objectType,
                number,
            });
        }
    }
    parseItemListByIndex(size, mode, nid, buffer) {
        if (this.onListItemsByIndex.observed) {
            const index = buffer.readUInt16LE(0);
            const deviceNID = buffer.readUInt16LE(2);
            const msSinceLastCommunication = buffer.readUInt16LE(4);
            if (deviceNID) {
                this.onListItemsByIndex.next({
                    index,
                    nid: deviceNID,
                    msSinceLastCommunication,
                });
            }
        }
    }
    parseItemListByNid(size, mode, nid, buffer) {
        if (this.onListItemsByNID.observed) {
            const NID = buffer.readUInt16LE(0);
            const index = buffer.readUInt16LE(2);
            const itemState = buffer.readUInt16LE(4);
            const lastTick = buffer.readUInt16LE(6);
            this.onListItemsByNID.next({
                nid: NID,
                index,
                itemState,
                lastTick,
            });
        }
    }
    parseDataClear(size, mode, nid, buffer) {
        if (this.onRemoveLocomotive.observed) {
            const NID = buffer.readUInt16LE(0);
            const state = buffer.readUInt16LE(2);
            this.onRemoveLocomotive.next({
                nid: NID,
                state: state,
            });
        }
    }
    parseItemImageConfig(size, mode, nid, buffer) {
        if (this.onItemImageConfig.observed) {
            const NID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const imageId = buffer.readUInt16LE(4);
            this.onItemImageConfig.next({
                nid: NID,
                type,
                imageId,
            });
        }
    }
    parseItemFxMode(size, mode, nid, buffer) {
        if (this.onItemFxMode.observed) {
            const NID = buffer.readUInt16LE(0);
            const group = buffer.readUInt8(2);
            const modes = buffer.readUInt32LE(4);
            const mode = [];
            for (let i = 0; i < 32; i += 2) {
                mode.push((modes >> i) & 0b11);
            }
            const msg = {
                nid: NID,
                group,
                mode,
            };
            this.mx10.log.next('parseItemFxMode: ' + JSON.stringify(msg));
            this.onItemFxMode.next(msg);
        }
    }
    parseItemFxConfig(size, mode, nid, buffer) {
        if (this.onItemFxConfig.observed) {
            const NID = buffer.readUInt16LE(0);
            const fx = buffer.readUInt16LE(2);
            const item = buffer.readUInt16LE(4);
            const data = buffer.readUInt16LE(6);
            const msg = {
                nid: NID,
                function: fx,
                item,
                data,
            };
            this.mx10.log.next('parseItemFxMode: ' + JSON.stringify(msg));
            this.onItemFxConfig.next(msg);
        }
    }
    parseDataNameExtended(size, mode, nid, buffer) {
        if (this.onDataNameExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const subID = buffer.readUInt16LE(2);
            const name = ExtendedASCII.byte2str(buffer.subarray(12, 203));
            let value1;
            const value2 = buffer.readUInt32LE(8);
            let type;
            switch (NID) {
                case 0x7f00:
                    type = NameType.MANUFACTURER;
                    break;
                case 0x7f02:
                    type = NameType.DECODER;
                    break;
                case 0x7f04:
                    type = NameType.DESIGNATION;
                    value1 = {
                        type: buffer.subarray(4).toString('ascii').trim(),
                        cfgNum: parseInt(buffer.subarray(5, 7).toString('ascii')),
                    };
                    break;
                case 0x7f06:
                    type = NameType.CFGDB;
                    break;
                case 0x7f10:
                    type = NameType.ICON;
                    break;
                case 0x7f11:
                    type = NameType.ICON;
                    break;
                case 0x7f18:
                    type = NameType.ZIMO_PARTNER;
                    break;
                case 0x7f20:
                    type = NameType.LAND;
                    break;
                case 0x7f21:
                    type = NameType.COMPANY_CV;
                    break;
                case 0xc2:
                    type = NameType.CONNECTION;
                    break;
                default:
                    if (subID == 1) {
                        type = NameType.COMPANY_CV;
                    }
                    else if (subID == 0) {
                        type = NameType.VEHICLE;
                    }
                    else {
                        type = NameType.CONNECTION;
                    }
            }
            this.onDataNameExtended.next({
                nid: NID,
                type,
                subID,
                value1,
                value2,
                name,
            });
        }
    }
}
//# sourceMappingURL=dataGroup.js.map
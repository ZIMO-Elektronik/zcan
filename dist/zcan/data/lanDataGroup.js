import { FunctionMode, getOperatingMode, OperatingMode } from '../../util/enums';
import { Subject } from 'rxjs';
import { parseSpeed } from '../../internal/speedUtils';
import ExtendedASCII from '../../util/extended-ascii';
import { manualModeB, shuntingFunctionB } from '../../internal/bites';
export default class LanDataGroup {
    onLocoGuiExtended = new Subject();
    onLocoGuiMXExtended = new Subject();
    onDataValueExtended = new Subject();
    onDataNameExtended = new Subject();
    onLocoSpeedTabExtended = new Subject();
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    dataValueExtended(NID) {
        this.mx10.sendData(0x17, 0x08, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: 1, length: 2 },
        ], 0b00);
    }
    dataNameExtended(NID) {
        this.mx10.sendData(0x17, 0x10, [
            { value: NID, length: 2 },
            { value: 0, length: 2 },
        ], 0b00);
    }
    renameDataExtended(NID, type, val1, val2, val3, name) {
        this.mx10.sendData(0x17, 0x10, [
            { value: NID, length: 2 },
            { value: type, length: 2 },
            { value: val1, length: 4 },
            { value: val2, length: 4 },
            { value: val3, length: 4 },
            { value: name, length: name.length },
            { value: 0, length: 1 },
        ], 0b01);
    }
    locoGuiExtended(NID) {
        this.mx10.sendData(0x17, 0x27, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: 0, length: 2 },
        ], 0b00);
    }
    locoGuiMXExtended(NID) {
        this.mx10.sendData(0x17, 0x28, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: 0, length: 2 },
        ], 0b00);
    }
    locoSpeedTapExtended(NID) {
        this.mx10.sendData(0x17, 0x19, [
            { value: this.mx10.mx10NID, length: 2 },
            { value: NID, length: 2 },
            { value: 0, length: 1 },
            { value: 0, length: 1 },
        ], 0b00);
    }
    mxUpdateFnIcons(destructuredBuffer) {
        this.mx10.sendData(0x17, 0x28, destructuredBuffer, 0b01);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x08:
                this.parseDataValueExtended(size, mode, nid, buffer);
                break;
            case 0x10:
                this.parseDataNameExtended(size, mode, nid, buffer);
                break;
            case 0x27:
                this.parseLocoGuiExtended(size, mode, nid, buffer);
                break;
            case 0x28:
                this.parseLocoGuiMXExtended(size, mode, nid, buffer);
                break;
            case 0x19:
                this.parseLocoSpeedTabExtended(size, mode, nid, buffer);
                break;
        }
    }
    parseDataValueExtended(size, mode, nid, buffer) {
        if (this.onDataValueExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const deletedFlag = buffer.readUInt8(4);
            const flagsBytes = buffer.readUInt32LE(4);
            const trackMode = buffer.readUInt8(24);
            const functionCount = buffer.readUInt8(25);
            const speedAndDirection = buffer.readUInt16LE(44);
            const { speedStep, forward, eastWest, emergencyStop } = parseSpeed(speedAndDirection);
            const operatingMode = getOperatingMode(trackMode);
            const flags = this.parseFlags(flagsBytes);
            let functions = buffer.readUInt32LE(46);
            const functionsStates = [];
            for (let i = 0; i < 31; i++) {
                const active = (functions & 1) == 1;
                functionsStates.push(active);
                functions = functions >> 1;
            }
            const specialFunc = buffer.readUInt32LE(50);
            const shuntingFunction = specialFunc & shuntingFunctionB;
            const manualMode = (specialFunc & manualModeB) >> 4;
            const deleted = this.parseDeleted(deletedFlag);
            this.onDataValueExtended.next({
                nid: NID,
                flags,
                functionCount,
                speedStep,
                forward,
                eastWest,
                emergencyStop,
                operatingMode,
                functionsStates,
                shuntingFunction,
                manualMode,
                deleted,
            });
        }
    }
    parseDataNameExtended(size, mode, nid, buffer) {
        if (this.onDataNameExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const type = buffer.readUInt16LE(2);
            const val1 = buffer.readUInt32LE(4);
            const val2 = buffer.readUInt32LE(8);
            const val3 = buffer.readUInt32LE(12);
            const name = ExtendedASCII.byte2str(buffer.subarray(16, 63));
            this.onDataNameExtended.next({
                nid: NID,
                name,
            });
        }
    }
    parseLocoGuiExtended(size, mode, nid, buffer) {
        if (this.onLocoGuiExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const SubID = buffer.readUInt16LE(2);
            const vehicleGroup = buffer.readUInt16LE(4);
            const name = ExtendedASCII.byte2str(buffer.subarray(6, 32));
            const imageId = buffer.readUInt16LE(38);
            const tacho = buffer.readUInt16LE(40);
            const speedFwd = buffer.readUInt16LE(42);
            const speedRev = buffer.readUInt16LE(44);
            const speedRange = buffer.readUInt16LE(46);
            const driveType = buffer.readUInt16LE(48);
            const era = buffer.readUInt16LE(50);
            const countryCode = buffer.readUInt16LE(52);
            const functions = Array();
            for (let i = 0; i < 32; i++) {
                const icon = buffer.readUInt16LE(54 + i * 2);
                const iconString = icon === 0 ? String(i).padStart(2, '0') : String(icon);
                functions.push({
                    mode: FunctionMode.switch,
                    active: false,
                    icon: iconString.padStart(4, icon === 0 ? '07' : '0'),
                });
            }
            this.onLocoGuiExtended.next({
                nid: NID,
                subId: SubID,
                name: name,
                group: vehicleGroup,
                image: imageId == 0 ? undefined : imageId.toString(),
                tacho: tacho.toString(),
                speedFwd: speedFwd,
                speedRev: speedRev,
                speedRange: speedRange,
                operatingMode: OperatingMode.UNKNOWN,
                driveType: driveType,
                era: this.parseEra(era),
                countryCode: countryCode,
                functions,
            });
        }
    }
    parseLocoGuiMXExtended(size, mode, nid, buffer) {
        if (this.onLocoGuiMXExtended.observed) {
            const NID = buffer.readUInt16LE(0);
            const name = ExtendedASCII.byte2str(buffer.subarray(12, 38));
            const imageId = buffer.readUInt16LE(44);
            const functions = Array();
            for (let i = 0; i < 32; i++) {
                const icon = buffer.readUInt16LE(68 + i * 2);
                const iconString = icon === 0 ? String(i).padStart(2, '0') : String(icon);
                functions.push({
                    mode: FunctionMode.switch,
                    active: false,
                    icon: iconString.padStart(4, icon === 0 ? '07' : '0'),
                });
            }
            this.onLocoGuiMXExtended.next({
                nid: NID,
                name: name,
                image: imageId == 0 ? undefined : imageId.toString(),
                destructuredBuffer: this.destructureBuffer(buffer),
                functions,
            });
        }
    }
    parseLocoSpeedTabExtended(size, mode, nid, buffer) {
        if (this.onLocoSpeedTabExtended.observed) {
            const setDBat6 = 5;
            const bufferLengthOfSpeedTab = 24;
            const SrcID = buffer.readUInt16LE(0);
            const NID = buffer.readUInt16LE(2);
            const DBat6 = buffer.readUInt8(5);
            let locoSpeedTab = undefined;
            if (DBat6 !== setDBat6) {
                locoSpeedTab = undefined;
            }
            else {
                locoSpeedTab = [];
                for (let i = 0; i < 4; i++) {
                    const offset = 6 + i * 4;
                    if (bufferLengthOfSpeedTab >= offset + 2) {
                        const speedStep = buffer.readUInt16LE(offset);
                        const speed = buffer.readUInt16LE(offset + 2);
                        locoSpeedTab.push({
                            id: i + 1,
                            speedStep: speedStep,
                            speed: speed,
                        });
                    }
                    else {
                        console.warn(`Train with id:${NID} has wrong speedStepTab buffer`);
                        break;
                    }
                }
            }
            this.onLocoSpeedTabExtended.next({
                srcid: SrcID,
                nid: NID,
                dbat6: DBat6,
                speedTab: locoSpeedTab,
            });
        }
    }
    parseEra(eraString) {
        switch (eraString & 0xf0) {
            case 0x10:
                return 'I';
            case 0x20:
                return 'II';
            case 0x30:
                return 'III';
            case 0x40:
                return 'IV';
            case 0x50:
                return 'V';
            case 0x60:
                return 'VI';
            case 0x70:
                return 'VII';
            default:
                return '';
        }
    }
    parseFlags(flagsNumber) {
        return {
            deleted: flagsNumber >> 31 === 1,
        };
    }
    parseDeleted(parseDeletedFlag) {
        return parseDeletedFlag === 1;
    }
    destructureBuffer(buffer) {
        const values = [];
        for (let i = 0; i < buffer.length; i += 2) {
            values.push({
                value: buffer.readUInt16LE(i),
                length: 2,
            });
        }
        return values;
    }
}
//# sourceMappingURL=lanDataGroup.js.map
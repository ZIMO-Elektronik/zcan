import { FxMode, MsgMode } from "../common/enums";
import { Message } from "../common/communication";
import ExtendedASCII from "../common/extendedAscii";
export class MsgLocoGuiReq extends Message {
    static header(mode, nid) { return { group: 0x17, cmd: 0x28, mode: mode, nid: nid }; }
    constructor(header, locoNid, subNid) {
        super(header);
        super.push({ value: locoNid, length: 2 });
        super.push({ value: subNid, length: 2 });
    }
    get nid() { return this.data[0].value; }
    get subNid() { return this.data[1].value; }
}
export class MsgLocoGuiRsp extends Message {
    static header(mode, nid) { return { group: 0x17, cmd: 0x28, mode: mode, nid: nid }; }
    constructor(header, locoNid, subId, version, flags, group, name, imageId, imageCrc, tachoId, tachoCrc, maxSpeedFwd, maxSpeedRev, shuntingSpeed, driveType, era, country, funImgs, fxModes) {
        super(header);
        super.push({ value: locoNid, length: 2 });
        super.push({ value: subId, length: 2 });
        super.push({ value: version, length: 4 });
        super.push({ value: flags, length: 2 });
        super.push({ value: group, length: 2 });
        super.push({ value: name, length: 32 });
        super.push({ value: imageId, length: 2 });
        super.push({ value: imageCrc, length: 4 });
        super.push({ value: tachoId, length: 2 });
        super.push({ value: tachoCrc, length: 4 });
        super.push({ value: maxSpeedFwd, length: 2 });
        super.push({ value: maxSpeedRev, length: 2 });
        super.push({ value: shuntingSpeed, length: 2 });
        super.push({ value: driveType, length: 2 });
        super.push({ value: era, length: 2 });
        super.push({ value: country, length: 2 });
        funImgs.forEach(img => super.push({ value: img, length: 2 }));
        fxModes.forEach(mode => super.push({ value: mode, length: 2 }));
    }
    get nid() { return this.data[0].value; }
    get subId() { return this.data[1].value; }
    get group() { return this.data[4].value; }
    get name() { return this.data[5].value; }
    get image() { return this.data[6].value; }
    get tacho() { return this.data[8].value; }
    get maxSpeedFwd() { return this.data[10].value; }
    get maxSpeedRev() { return this.data[11].value; }
    get shuntingSpeed() { return this.data[12].value; }
    get driveType() { return this.data[13].value; }
    get era() { return this.data[14].value; }
    get country() { return this.data[15].value; }
    get fx() {
        const rv = Array();
        for (let i = 16; i < 80; i++) {
            const icon = this.data[i].value;
            rv.push({ icon, mode: FxMode.TOGGLE, active: false, time: 0 });
        }
        for (let i = 80; i < 144; i++) {
            rv[i - 80].mode = this.data[i].value >> 14;
            rv[i - 80].time = this.data[i].value & 0x3fff;
        }
        return rv;
    }
    static fromBuffer(mode, nid, buffer) {
        const NID = buffer.readUInt16LE(0);
        const SubID = buffer.readUInt16LE(2);
        const version = buffer.readUInt32LE(4);
        const flags = buffer.readUInt16LE(8);
        const group = buffer.readUInt16LE(10);
        const name = ExtendedASCII.byte2str(buffer.subarray(12, 32));
        const imageId = buffer.readUInt16LE(44);
        const imageCrc = buffer.readUInt32LE(46);
        const tachoId = buffer.readUInt16LE(50);
        const tachoCrc = buffer.readUInt32LE(52);
        const maxSpeedFwd = buffer.readUInt16LE(56);
        const maxSpeedRev = buffer.readUInt16LE(58);
        const shuntingSpeed = buffer.readUInt16LE(60);
        const driveType = buffer.readUInt16LE(62);
        const era = buffer.readUInt16LE(64);
        const country = buffer.readUInt16LE(66);
        const funImg = [];
        for (let i = 0; i < 64; i++) {
            const img = buffer.readUInt16LE(68 + 2 * i);
            funImg.push(img);
        }
        const funMode = [];
        for (let i = 0; i < 64; i++) {
            const fmode = buffer.readUInt16LE(196 + 2 * i);
            funMode.push(fmode);
        }
        return new MsgLocoGuiRsp(MsgLocoGuiRsp.header(mode, nid), NID, SubID, version, flags, group, name, imageId, imageCrc, tachoId, tachoCrc, maxSpeedFwd, maxSpeedRev, shuntingSpeed, driveType, era, country, funImg, funMode);
    }
    static parseEra(era) {
        switch (era & 0xf0) {
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
}
export class MsgDataValueX extends Message {
    static header(mode, nid) { return { group: 0x17, cmd: 0x08, mode: mode, nid: nid }; }
    constructor(header, nid, subId, data) {
        super(header);
        super.push({ value: nid, length: 2 });
        super.push({ value: subId, length: 2 });
        if (data)
            super.push(...data);
    }
    get nid() { return this.data[0].value; }
    get subId() { return this.data[1].value; }
    get decoder() {
        return { vendor: this.data[2].value, uid: this.data[3].value,
            type: this.data[4].value, sound: this.data[5].value };
    }
    get stepMax() { return this.data[6].value; }
    get opMode() { return (this.data[6].value >> 4); }
    get funCount() { return this.data[7].value; }
    get txCount() { return this.data[8].value; }
    get rxCount() { return this.data[9].value; }
    get something() { return this.data[10].value; }
    get owner() { return { nid: this.data[11].value, tick: this.data[12].value }; }
    get groupie() { return { nid: this.data[13].value, tick: this.data[14].value }; }
    get dirBits() {
        return { reverseCmd: !!(this.data[15].value & 0x400),
            reverseAck: !!(this.data[15].value & 0x800), stop: !!(this.data[15].value & 0x8000) };
    }
    get speedStep() { return this.data[15].value & 0x3ff; }
    get digtalFun() {
        return this.data[16].value.toString(2).padStart(32, '0').split('').reverse().map(bit => bit === '1');
    }
    get specialFun() {
        return {
            shunt: parseInt(this.data[17].value.toString(2).padStart(32, '0').split('').reverse().slice(0, 4).join(''), 2),
            man: parseInt(this.data[17].value.toString(2).padStart(32, '0').split('').reverse().slice(4, 6).join(''), 2)
        };
    }
    get analogFun() { return this.data.slice(18, 64).map(fun => fun.value).map(fun => { return { id: fun & 0xff, state: fun >> 8 }; }); }
    static fromBuffer(mode, nid, buffy) {
        const locoNid = buffy.readUInt16LE(0);
        const subId = buffy.readUInt16LE(2);
        let offset = 4;
        const data = [];
        const slices = [2, 4, 2, 4, 1, 1, 2, 2, 2, 2, 4, 2, 4, 2, 4, 4];
        for (let i = 0; i < 32; i++)
            slices.push(2);
        for (let length of slices) {
            let value = 0;
            switch (length) {
                case 1:
                    value = buffy.readUInt8(offset);
                    break;
                case 2:
                    value = buffy.readUInt16LE(offset);
                    break;
                case 4:
                    value = buffy.readUInt32LE(offset);
                    break;
            }
            data.push({ value, length });
            offset += length;
        }
        return new MsgDataValueX(MsgDataValueX.header(mode, nid), locoNid, subId, data);
    }
}
export class MsgItemListByIdxX extends Message {
    static header(mode, nid) { return { group: 0x17, cmd: 0x01, mode: mode, nid: nid }; }
    constructor(header, idx, data, group) {
        super(header);
        if (group !== undefined)
            super.push({ value: group, length: 2 });
        super.push({ value: idx, length: 2 });
        if (data && data.length)
            super.push(...data);
    }
    get idx() { return this.data[this.header.mode === MsgMode.REQ ? 1 : 0].value; }
    get nid() { return this.data[1].value; }
    get stepMax() { return this.data[2].value; }
    get opMode() { return (this.data[2].value >> 4); }
    get speedStep() { return this.data[3].value & 0x3ff; }
    get direction() { return !!(this.data[3].value & 0x400); }
    get directionAck() { return !!(this.data[3].value & 0x800); }
    get eastWest() { return (this.data[3].value >> 12) & 3; }
    get railCom() { return !!(this.data[3].value & 0x4000); }
    get zimoAck() { return !!(this.data[3].value & 0x8000); }
    get eStop() { return !!(this.data[4].value & 0x1); }
    get cabEw() { return !!(this.data[4].value & 0x2); }
    get hasTrain() { return !!(this.data[4].value & 0x4); }
    get deleted() { return !!(this.data[4].value & 0x80); }
    get fxCount() { return this.data[5].value; }
    get axCount() { return this.data[6].value; }
    get fxState() { return this.data[7].value.toString(2).padStart(64, '0').split('').reverse().map(bit => bit === '1'); }
    get owner() { return { nid: this.data[8].value, tick: this.data[9].value }; }
    get trainNid() { return this.data[10].value; }
    static fromBuffer(mode, nid, buffy) {
        const idx = buffy.readUInt16LE(0);
        const locoNid = buffy.readUInt16LE(2);
        let offset = 4;
        const data = [{ value: locoNid, length: 2 }];
        const slices = [1, 2, 1, 1, 1, 8, 2, 4, 2];
        for (let length of slices) {
            let value = 0;
            switch (length) {
                case 1:
                    value = buffy.readUInt8(offset);
                    break;
                case 2:
                    value = buffy.readUInt16LE(offset);
                    break;
                case 4:
                    value = buffy.readUInt32LE(offset);
                    break;
                case 8:
                    value = (buffy.readUInt32LE(offset + 4) << 32) | buffy.readUInt32LE(offset);
                    break;
            }
            data.push({ value, length });
            offset += length;
        }
        return new MsgItemListByIdxX(MsgItemListByIdxX.header(mode, nid), idx, data);
    }
}
//# sourceMappingURL=lanDataMsg.js.map
import { Subject } from 'rxjs';
import { MsgMode, } from '../util/enums';
import { combineSpeedAndDirection, parseSpeed, } from '../internal/speedUtils';
import { Query } from '../@types/communication';
import { MsgVehicleMode } from './vehicleMsg';
export default class VehicleGroup {
    onVehicleState = new Subject();
    onVehicleMode = new Subject();
    onChangeSpeed = new Subject();
    onCallFunction = new Subject();
    onCallSpecialFunction = new Subject();
    modeQ = undefined;
    mx10;
    constructor(mx10) { this.mx10 = mx10; }
    async getVehicleMode(trainNid) {
        if (this.modeQ !== undefined && !await this.modeQ.lock()) {
            this.mx10.log.next("mx10.getVehicleMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgVehicleMode.header(MsgMode.REQ, trainNid), this.onVehicleMode);
        this.modeQ.log = ((msg) => { this.mx10.log.next(msg); });
        this.modeQ.tx = ((header) => {
            const msg = new MsgVehicleMode(header);
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            return (msg.trainNid() === trainNid);
        });
        const rv = await this.modeQ.run();
        this.mx10.log.next("mx10.getVehicleMode.rv: " + JSON.stringify(rv));
        this.modeQ.unlock();
        this.modeQ = undefined;
        return rv;
    }
    async setVehicleMode(trainNid, opMode, speedSteps) {
        MsgVehicleMode.log = (msg) => { this.mx10.log.next(msg); };
        if (this.modeQ !== undefined && !await this.modeQ.lock()) {
            this.mx10.log.next("mx10.setVehicleMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgVehicleMode.header(MsgMode.CMD, trainNid), this.onVehicleMode);
        this.modeQ.log = (msg) => { this.mx10.log.next(msg); };
        this.modeQ.tx = ((header) => {
            const msg = new MsgVehicleMode(header, { opMode, speedSteps });
            this.mx10.log.next('mode query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            this.mx10.log.next('mode query rx: ' + JSON.stringify(msg));
            return (msg.trainNid() === trainNid);
        });
        const rv = await this.modeQ.run(MsgVehicleMode.rxDelay());
        this.mx10.log.next("mx10.setVehicleMode.rv: " + JSON.stringify(rv));
        this.modeQ.unlock();
        this.modeQ = undefined;
        return rv;
    }
    changeSpeed(vehicleAddress, speedStep, forward, eastWest, emergencyStop) {
        const speedAndDirection = combineSpeedAndDirection(speedStep, forward, eastWest, emergencyStop);
        this.mx10.sendData(0x02, 0x02, [
            { value: vehicleAddress, length: 2 },
            { value: speedAndDirection, length: 2 },
            { value: 0x0000, length: 2 },
        ]);
    }
    callFunction(vehicleAddress, functionId, functionStatus) {
        this.mx10.sendData(0x02, 0x04, [
            { value: vehicleAddress, length: 2 },
            { value: functionId, length: 2 },
            { value: Number(functionStatus), length: 2 },
        ]);
    }
    changeSpecialFunction(vehicleAddress, specialFunctionMode, specialFunctionStatus) {
        this.mx10.sendData(0x02, 0x05, [
            { value: vehicleAddress, length: 2 },
            { value: specialFunctionMode, length: 2 },
            { value: specialFunctionStatus, length: 2 },
        ]);
    }
    vehicleState(vehicleAddress) {
        return this.mx10.sendData(0x02, 0x00, [{ value: vehicleAddress, length: 2 }], 0b00);
    }
    activeModeTrain(vehicleAddress) {
        return this.mx10.sendData(0x02, 0x10, [
            { value: vehicleAddress, length: 2 },
            { value: 0x01, length: 2 },
        ], 0b01);
    }
    activeModeTakeOver(vehicleAddress) {
        return this.mx10.sendData(0x02, 0x10, [
            { value: vehicleAddress, length: 2 },
            { value: 0x10, length: 2 },
        ], 0b01);
    }
    parse(size, command, mode, nid, buffer) {
        this.mx10.log.next("mx10.vehicleGroup.parse: " + command + "," + nid + "," + JSON.stringify(buffer));
        switch (command) {
            case 0x00:
                this.parseVehicleState(size, mode, nid, buffer);
                break;
            case 0x01:
                this.parseVehicleMode(size, mode, nid, buffer);
                break;
            case 0x02:
                this.parseVehicleSpeed(size, mode, nid, buffer);
                break;
            case 0x04:
                this.parseVehicleFunction(size, mode, nid, buffer);
                break;
            case 0x05:
                this.parseVehicleSpecialFunction(size, mode, nid, buffer);
                break;
        }
    }
    parseVehicleState(size, mode, nid, buffer) {
        if (this.onVehicleState.observed) {
            const NID = buffer.readUInt16LE(0);
            const stateFlags = buffer.readUInt16LE(2);
            const ctrlTick = buffer.readUInt16LE(4);
            const ctrlDevice = buffer.readUInt16LE(6);
            this.onVehicleState.next({
                nid: NID,
                ctrlTick,
                ctrlDevice,
            });
        }
    }
    parseVehicleMode(size, mode, nid, buffer) {
        if (this.onVehicleMode.observed) {
            const NID = buffer.readUInt16LE(0);
            const vMode = [buffer.readUInt8(2), buffer.readUInt8(3), buffer.readUInt8(4)];
            this.onVehicleMode.next(new MsgVehicleMode(MsgVehicleMode.header(mode, NID), vMode));
        }
    }
    parseVehicleSpeed(size, mode, nid, buffer) {
        if (this.onChangeSpeed.observed) {
            const NID = buffer.readUInt16LE(0);
            const speedAndDirection = buffer.readUInt16LE(2);
            const divisor = buffer.readUint8(4);
            const { speedStep, forward, eastWest, emergencyStop } = parseSpeed(speedAndDirection);
            this.onChangeSpeed.next({
                nid: NID,
                divisor,
                speedStep,
                forward,
                eastWest,
                emergencyStop,
            });
        }
    }
    parseVehicleFunction(size, mode, nid, buffer) {
        if (this.onCallFunction.observed) {
            const NID = buffer.readUInt16LE(0);
            const functionNumber = buffer.readUInt16LE(2);
            const functionState = buffer.readUInt16LE(4);
            const functionActive = functionState !== 0x00;
            this.onCallFunction.next({
                nid: NID,
                functionNumber,
                functionState: functionActive,
            });
        }
    }
    parseVehicleSpecialFunction(size, mode, nid, buffer) {
        if (this.onCallSpecialFunction.observed) {
            const NID = buffer.readUInt16LE(0);
            const specialFunctionMode = buffer.readUInt16LE(2);
            const specialFunctionState = buffer.readUInt16LE(4);
            this.onCallSpecialFunction.next({
                nid: NID,
                specialFunctionMode,
                specialFunctionState,
            });
        }
    }
}
//# sourceMappingURL=vehicleGroup.js.map
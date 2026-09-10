import { Subject } from 'rxjs';
import { Direction, MsgMode } from '../common/enums';
import { Query } from '../common/communication';
import { MsgFx, MsgFxStates, MsgSpecialFx, MsgVehicleLastCtl, MsgVehicleMode, MsgVehicleSpeed, MsgVehicleState } from './vehicleMsg';
export default class VehicleGroup {
    onVehicleState = new Subject();
    onVehicleLastCtl = new Subject();
    onVehicleMode = new Subject();
    onVehicleSpeed = new Subject();
    onCallFunction = new Subject();
    onFxStates = new Subject();
    onCallSpecialFunction = new Subject();
    stateQ = undefined;
    lastCtlQ = undefined;
    modeQ = undefined;
    speedQ = undefined;
    fxQ = undefined;
    fxStatesQ = undefined;
    sfxQ = undefined;
    mx10;
    constructor(mx10) { this.mx10 = mx10; }
    async getState(nid) {
        if (this.stateQ !== undefined && !await Query.wait(() => !!this.stateQ)) {
            this.mx10.logInfo.next("mx10.getVehicleState: failed to acquire lock");
            return undefined;
        }
        this.stateQ = new Query(MsgVehicleState.header(MsgMode.REQ, nid), this.onVehicleState);
        this.stateQ.tx = ((header) => {
            const msg = new MsgVehicleState(header);
            this.mx10.sendMsg(msg);
        });
        this.stateQ.match = ((msg) => {
            return (msg.trainNid() === nid);
        });
        const rv = await this.stateQ.run();
        this.stateQ = undefined;
        return rv;
    }
    async getLastController(locoNid, type = 1) {
        if (this.lastCtlQ !== undefined && !await Query.wait(() => !!this.lastCtlQ)) {
            this.mx10.logInfo.next("mx10.getVehicleLastCtl: failed to acquire lock");
            return undefined;
        }
        this.lastCtlQ = new Query(MsgVehicleLastCtl.header(MsgMode.REQ, locoNid), this.onVehicleLastCtl);
        this.lastCtlQ.tx = ((header) => {
            const msg = new MsgVehicleLastCtl(header, type);
            this.mx10.logInfo.next('lastCtl query tx: ' + JSON.stringify(msg));
            this.mx10.sendMsg(msg);
        });
        this.lastCtlQ.match = ((msg) => {
            this.mx10.logInfo.next('lastCtl query rx: ' + JSON.stringify(msg));
            return (msg.trainNid() === locoNid);
        });
        const rv = await this.lastCtlQ.run();
        this.mx10.logInfo.next("mx10.getVehicleLastCtl.rv: " + JSON.stringify(rv));
        this.lastCtlQ = undefined;
        return rv;
    }
    async getMode(nid) {
        if (this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
            this.mx10.logInfo.next("mx10.getVehicleMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgVehicleMode.header(MsgMode.REQ, nid), this.onVehicleMode);
        this.modeQ.tx = ((header) => {
            const msg = new MsgVehicleMode(header);
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            return (msg.nid === nid);
        });
        const rv = await this.modeQ.run();
        this.modeQ = undefined;
        return rv;
    }
    async setMode(nid, opMode, speedSteps) {
        MsgVehicleMode.log = (msg) => { this.mx10.logInfo.next(msg); };
        if (this.modeQ !== undefined && !await Query.wait(() => !!this.modeQ)) {
            this.mx10.logInfo.next("mx10.setVehicleMode: failed to acquire lock");
            return undefined;
        }
        this.modeQ = new Query(MsgVehicleMode.header(MsgMode.CMD, nid), this.onVehicleMode);
        this.modeQ.tx = ((header) => {
            const msg = new MsgVehicleMode(header, { opMode, speedSteps });
            this.mx10.sendMsg(msg);
        });
        this.modeQ.match = ((msg) => {
            return (msg.nid === nid);
        });
        const rv = await this.modeQ.run();
        this.modeQ = undefined;
        return rv;
    }
    async getSpeed(nid) {
        if (this.speedQ !== undefined && !await Query.wait(() => !!this.speedQ)) {
            this.mx10.logInfo.next("mx10.getVehicleSpeed: failed to acquire lock");
            return undefined;
        }
        this.speedQ = new Query(MsgVehicleSpeed.header(MsgMode.REQ, nid), this.onVehicleSpeed);
        this.speedQ.tx = ((header) => {
            const msg = new MsgVehicleSpeed(header);
            this.mx10.sendMsg(msg);
        });
        this.speedQ.match = ((msg) => {
            return (msg.nid === nid);
        });
        const rv = await this.speedQ.run();
        this.speedQ = undefined;
        return rv;
    }
    async setSpeed(nid, speedStep, divisor = 0, forward = true, emergencyStop = false, eastWest = Direction.UNDEFINED) {
        MsgVehicleSpeed.log = (msg) => { this.mx10.logInfo.next(msg); };
        if (this.speedQ !== undefined && !await Query.wait(() => !!this.speedQ)) {
            this.mx10.logInfo.next("mx10.setVehicleSpeed: failed to acquire lock");
            return undefined;
        }
        this.speedQ = new Query(MsgVehicleSpeed.header(MsgMode.CMD, nid), this.onVehicleSpeed);
        this.speedQ.tx = ((header) => {
            const speedAndDir = MsgVehicleSpeed.speedAndDir(speedStep, forward, emergencyStop, eastWest);
            const msg = new MsgVehicleSpeed(header, speedAndDir, divisor);
            this.mx10.sendMsg(msg);
        });
        this.speedQ.match = ((msg) => {
            return (msg.nid === nid && msg.speedStep === speedStep && msg.divisor === msg.divisor &&
                msg.emergencyStop === emergencyStop && msg.forward === forward);
        });
        const rv = await this.speedQ.run(MsgVehicleSpeed.rxDelay());
        this.speedQ = undefined;
        return rv;
    }
    async changeSpeed(nid, speedStep, divisor = 0, forward = true, emergencyStop = false, eastWest = Direction.UNDEFINED) {
        if (this.speedQ !== undefined && !await Query.wait(() => !!this.speedQ, 0)) {
            this.mx10.logInfo.next("vehicle.changeSpeed: failed to acquire lock");
            return undefined;
        }
        this.speedQ = new Query(MsgVehicleSpeed.header(MsgMode.CMD, nid), this.onVehicleSpeed);
        this.speedQ.tx = ((header) => {
            const speedAndDir = MsgVehicleSpeed.speedAndDir(speedStep, forward, emergencyStop, eastWest);
            const msg = new MsgVehicleSpeed(header, speedAndDir, divisor);
            this.mx10.sendMsg(msg);
        });
        this.speedQ.match = ((msg) => {
            return (msg.nid === nid && msg.speedStep === speedStep && msg.divisor === msg.divisor &&
                msg.emergencyStop === emergencyStop && msg.forward === forward);
        });
        this.speedQ.subscribe(false);
        const rv = await this.speedQ.run(20, 1);
        this.mx10.logInfo.next("vehicle.changeSpeed.rv: " + JSON.stringify(rv));
        this.speedQ = undefined;
        return rv;
    }
    callFunction(vehicleAddress, functionId, functionStatus) {
        this.mx10.sendData(0x02, 0x04, [
            { value: vehicleAddress, length: 2 },
            { value: functionId, length: 2 },
            { value: Number(functionStatus), length: 2 },
        ]);
    }
    async getFx(nid, fxNr) {
        if (this.fxQ !== undefined && !await Query.wait(() => !!this.fxQ)) {
            this.mx10.logInfo.next("mx10.getFx: failed to acquire lock");
            return undefined;
        }
        this.fxQ = new Query(MsgFx.header(MsgMode.REQ, nid), this.onCallFunction);
        this.fxQ.tx = ((header) => {
            const msg = new MsgFx(header, fxNr);
            this.mx10.sendMsg(msg);
        });
        this.fxQ.match = ((msg) => {
            return (msg.nid() === nid && msg.fxNr() === fxNr);
        });
        const rv = await this.fxQ.run();
        this.mx10.logInfo.next("mx10.getFx.rv: " + JSON.stringify(rv));
        this.fxQ = undefined;
        return rv;
    }
    async setFx(nid, fxNr, state) {
        if (this.fxQ !== undefined && !await Query.wait(() => !!this.fxQ)) {
            this.mx10.logInfo.next("mx10.setFx: failed to acquire lock");
            return undefined;
        }
        this.fxQ = new Query(MsgFx.header(MsgMode.CMD, nid), this.onCallFunction);
        this.fxQ.tx = ((header) => {
            const msg = new MsgFx(header, fxNr, state);
            this.mx10.sendMsg(msg);
        });
        this.fxQ.match = ((msg) => {
            return (msg.nid() === nid && msg.fxNr() === fxNr);
        });
        const rv = await this.fxQ.run();
        this.mx10.logInfo.next("mx10.setFx.rv: " + JSON.stringify(rv));
        this.fxQ = undefined;
        return rv;
    }
    async getFxStates(nid) {
        if (this.fxStatesQ !== undefined && !await Query.wait(() => !!this.fxStatesQ)) {
            this.mx10.logInfo.next("mx10.getFxStates: failed to acquire lock");
            return undefined;
        }
        this.fxStatesQ = new Query(MsgFxStates.header(MsgMode.REQ, nid), this.onFxStates);
        this.fxStatesQ.tx = ((header) => {
            const msg = new MsgFxStates(header);
            this.mx10.sendMsg(msg);
        });
        this.fxStatesQ.match = ((msg) => {
            return (msg.nid() === nid);
        });
        const rv = await this.fxStatesQ.run();
        this.mx10.logInfo.next("mx10.getFxStates.rv: " + JSON.stringify(rv));
        this.fxStatesQ = undefined;
        return rv;
    }
    async getSpecialFx(nid, sfxNr) {
        if (this.sfxQ !== undefined && !await Query.wait(() => !!this.sfxQ)) {
            this.mx10.logInfo.next("mx10.getSpecialFx: failed to acquire lock");
            return undefined;
        }
        this.sfxQ = new Query(MsgSpecialFx.header(MsgMode.REQ, nid), this.onCallSpecialFunction);
        this.sfxQ.tx = ((header) => {
            const msg = new MsgSpecialFx(header, sfxNr);
            this.mx10.sendMsg(msg);
        });
        this.sfxQ.match = ((msg) => {
            return (msg.nid() === nid && msg.sfxNr() === sfxNr);
        });
        const rv = await this.sfxQ.run();
        this.mx10.logInfo.next("mx10.getSpecialFx.rv: " + JSON.stringify(rv));
        this.sfxQ = undefined;
        return rv;
    }
    async setSpecialFx(nid, sfxNr, state) {
        if (this.sfxQ !== undefined && !await Query.wait(() => !!this.sfxQ)) {
            this.mx10.logInfo.next("mx10.setSpecialFx: failed to acquire lock");
            return undefined;
        }
        this.sfxQ = new Query(MsgSpecialFx.header(MsgMode.CMD, nid), this.onCallSpecialFunction);
        this.sfxQ.tx = ((header) => {
            const msg = new MsgSpecialFx(header, sfxNr, state);
            this.mx10.sendMsg(msg);
        });
        this.sfxQ.match = ((msg) => {
            return (msg.nid() === nid && msg.sfxNr() === sfxNr);
        });
        const rv = await this.sfxQ.run();
        this.mx10.logInfo.next("mx10.setSpecialFx.rv: " + JSON.stringify(rv));
        this.sfxQ = undefined;
        return rv;
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
    favoritePrio(nid1, nid2 = 0, nid3 = 0, nid4 = 0) {
        return this.mx10.sendData(0x02, 0x11, [
            { value: nid1, length: 2 },
            { value: nid2, length: 2 },
            { value: nid3, length: 2 },
            { value: nid4, length: 2 },
        ], 0b01);
    }
    parse(size, command, mode, nid, buffer) {
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
            case 0x03:
                this.parseVehicleFxStates(size, mode, nid, buffer);
                break;
            case 0x04:
                this.parseVehicleFunction(size, mode, nid, buffer);
                break;
            case 0x05:
                this.parseVehicleSpecialFunction(size, mode, nid, buffer);
                break;
            case 0x12:
                this.parseVehicleLastCtl(size, mode, nid, buffer);
                break;
        }
    }
    parseVehicleState(size, mode, nid, buffer) {
        if (!this.onVehicleState.observed)
            return;
        const msg = MsgVehicleState.fromBuffer(mode, buffer);
        this.onVehicleState.next(msg);
    }
    parseVehicleMode(size, mode, nid, buffer) {
        if (this.onVehicleMode.observed) {
            this.onVehicleMode.next(MsgVehicleMode.fromBuffer(mode, buffer));
        }
    }
    parseVehicleSpeed(size, mode, nid, buffer) {
        if (!this.onVehicleSpeed.observed)
            return;
        const msg = MsgVehicleSpeed.fromBuffer(mode, buffer);
        this.mx10.locoSpeed.set(msg.nid, msg.speedStep);
        this.mx10.logInfo.next('parseVehicleSpeed: ' + JSON.stringify(msg));
        this.onVehicleSpeed.next(msg);
    }
    parseVehicleFxStates(size, mode, nid, buffer) {
        if (this.onFxStates.observed) {
            const msg = MsgFxStates.fromBuffer(mode, buffer);
            this.onFxStates.next(msg);
        }
    }
    parseVehicleFunction(size, mode, nid, buffer) {
        if (this.onCallFunction.observed) {
            const msg = MsgFx.fromBuffer(mode, buffer);
            this.onCallFunction.next(msg);
        }
    }
    parseVehicleSpecialFunction(size, mode, nid, buffer) {
        if (!this.onCallSpecialFunction.observed)
            return;
        this.onCallSpecialFunction.next(MsgSpecialFx.fromBuffer(mode, buffer));
    }
    parseVehicleLastCtl(size, mode, nid, buffer) {
        if (!this.onVehicleLastCtl.observed)
            return;
        const NID = buffer.readUInt16LE(0);
        const type = buffer.readUInt16LE(2);
        const ctlNid = buffer.readUInt16LE(4);
        const seconds = buffer.readUInt16LE(6);
        const msg = new MsgVehicleLastCtl(MsgVehicleLastCtl.header(mode, NID), type, ctlNid, seconds);
        this.onVehicleLastCtl.next(msg);
    }
}
//# sourceMappingURL=vehicleGroup.js.map
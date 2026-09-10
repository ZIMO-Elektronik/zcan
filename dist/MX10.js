import { Buffer } from 'buffer';
import { interval, Subject } from 'rxjs';
import { Message, Query } from './common/communication';
import { AccessoryGroup, DataGroup, FileControlGroup, FileTransferGroup, InfoGroup, LanDataGroup, LanInfoGroup, LanNetworkGroup, LanLocoStateGroup, LanZimoProgrammableScriptGroup, NetworkGroup, PropertyConfigGroup, RailwayControlGroup, SystemControlGroup, TrackCfgGroup, TrainControlGroup, VehicleGroup, ZimoProgrammableScriptGroup, MsgMode } from './';
import ExtendedASCII from './common/extendedAscii';
export default class MX10 {
    myNID = 0;
    mx10NID = 0;
    mx10IP;
    connected = false;
    onConnect = () => { };
    onDisconnect = () => { };
    onTimeout = () => { };
    systemControl = new SystemControlGroup(this);
    accessory = new AccessoryGroup(this);
    vehicle = new VehicleGroup(this);
    trainControl = new TrainControlGroup(this);
    trackCfg = new TrackCfgGroup(this);
    data = new DataGroup(this);
    info = new InfoGroup(this);
    propertyConfig = new PropertyConfigGroup(this);
    network = new NetworkGroup(this);
    railwayControl = new RailwayControlGroup(this);
    zimoProgrammableScript = new ZimoProgrammableScriptGroup(this);
    fileControl = new FileControlGroup(this);
    fileTransfer = new FileTransferGroup(this);
    lanInfo = new LanInfoGroup(this);
    lanData = new LanDataGroup(this);
    lanLocoState = new LanLocoStateGroup(this);
    lanNetwork = new LanNetworkGroup(this);
    lanZimoProgrammableScript = new LanZimoProgrammableScriptGroup(this);
    logError = new Subject();
    logWarning = new Subject();
    logInfo = new Subject();
    mx10Socket = null;
    incomingPort = 14521;
    outgoingPort = 14520;
    lastPing = 0;
    interval = undefined;
    clientName;
    clientId;
    debugCommunication;
    reconnectionTime = 0;
    locoSpeed = new Map();
    constructor(ownNid, clientName, clientId, pingTimeoutMs = 4000, debug = false) {
        Query.log = (msg) => this.logInfo.next(msg);
        Message.log = (msg) => this.logInfo.next(msg);
        this.debugCommunication = debug;
        this.reconnectionTime = 2000;
        this.clientName = clientName;
        this.clientId = clientId;
        this.myNID = ownNid;
        interval(1000).subscribe(async () => {
            if (this.connected) {
                const msg = await this.network.ping(this.myNID);
                if (msg)
                    this.lastPing = Date.now();
                else if (Date.now() - this.lastPing > pingTimeoutMs) {
                    this.logInfo.next('No ping for ' + (pingTimeoutMs / 1000) + ' seconds!');
                    this.onTimeout();
                }
            }
        });
    }
    async initSocket(createSocketFunction, ipAddress, incomingPort = 14521, outgoingPort = 14520) {
        this.incomingPort = incomingPort;
        this.outgoingPort = outgoingPort;
        this.mx10IP = ipAddress;
        if (this.mx10Socket) {
            this.logInfo.next('.initSocket: ' + 'closing socket');
            await this.closeSocket();
        }
        if (this.mx10Socket == null) {
            this.logInfo.next('.initSocket: ' + 'creating socket');
            const socket = (this.mx10Socket = createSocketFunction({ type: 'udp4' }));
            this.logInfo.next('.initSocket: ' + 'socket = ' + JSON.stringify(socket));
            await new Promise((resolve) => {
                socket.bind(incomingPort, () => {
                    resolve(null);
                });
            });
            this.logInfo.next('.initSocket: ' + 'socket. = ' + JSON.stringify(socket));
            this.mx10Socket.on('message', this.readRawData.bind(this));
            this.logInfo.next('.initSocket: ' + 'socket.. = ' + JSON.stringify(socket));
            const ping = await this.network.ping();
            if (ping) {
                this.connected = true;
            }
            else {
                const ack = await this.lanNetwork.portOpen(this.clientName, this.clientId);
                if (ack) {
                    this.mx10NID = ack.header.nid || 0;
                    this.connected = true;
                }
            }
            if (this.connected) {
                this.logInfo.next('.initSocket: ' + 'created socket');
                this.onConnect();
            }
            else {
                this.logInfo.next('.initSocket: ' + 'failed to connect');
            }
        }
        else {
            this.logInfo.next('.initSocket: ' + 'socket wasnt null');
        }
    }
    reconnectLogic() {
        const date = Date.now();
        if (date - this.lastPing < this.reconnectionTime && this.interval !== undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        if (this.interval === undefined) {
            this.interval = setInterval(() => {
                if (!this.connected) {
                    this.logInfo.next('Reconnecting...');
                    this.network.portClose();
                    this.connected = false;
                    this.mx10NID = 0;
                    this.lanNetwork.portOpen(this.clientName, this.clientId);
                    this.network.ping();
                }
            }, this.reconnectionTime);
        }
        this.lastPing = date;
    }
    async closeSocket() {
        this.logInfo.next('.closeSocket');
        if (this.mx10Socket != null) {
            await this.network.portClose();
            this.mx10Socket?.close();
            this.mx10Socket = null;
        }
        this.mx10NID = 0;
        this.connected = false;
        this.onDisconnect();
    }
    sendMsg(msg, force = false) {
        const buffer = msg.udp(this.myNID);
        if (msg.header.group !== 0xa || msg.header.cmd !== 0)
            this.logInfo.next("mx10.sendMsg: " + JSON.stringify(buffer));
        this.send(buffer, force);
    }
    sendData(group, cmd, data = [], mode = MsgMode.CMD, nid = this.myNID, force = false) {
        const buffer = this.formatData(group, cmd, mode, nid, data);
        this.send(buffer, force);
    }
    formatData(group, cmd, mode, nid, data = []) {
        const size = data.reduce((sum, obj) => sum + obj.length, 0);
        const buffer = Buffer.alloc(size + 8);
        const cmd_md = (cmd << 2) | mode;
        buffer.writeUInt16LE(size, 0);
        buffer.writeUInt16LE(0, 2);
        buffer.writeUInt8(group, 4);
        buffer.writeUInt8(cmd_md, 5);
        buffer.writeUInt16LE(nid, 6);
        let offset = 8;
        data.forEach((element) => {
            if (typeof element.value === 'string') {
                ExtendedASCII.str2byte(element.value, buffer, offset, element.length);
                offset += element.length;
            }
            else {
                switch (element.length) {
                    case 1:
                        buffer.writeUInt8(element.value, offset);
                        offset += 1;
                        break;
                    case 2:
                        buffer.writeUInt16LE(element.value, offset);
                        offset += 2;
                        break;
                    case 4:
                        buffer.writeUInt32LE(element.value, offset);
                        offset += 4;
                        break;
                    default:
                        console.warn(`ELEMENT LENGTH NOT DEFINED, ${element}`);
                }
            }
        });
        this.printReadout(group, cmd, mode, nid, size, buffer.slice(8));
        return buffer;
    }
    send(message, force = false) {
        if (!this.connected && !force) {
            this.logInfo.next('unable to send ' + JSON.stringify(message));
            return;
        }
        this.mx10Socket?.send(message, 0, message.length, this.outgoingPort, this.mx10IP, (err) => {
            if (err && this.debugCommunication)
                this.logInfo.next(err.message);
        });
    }
    readRawData(message, rinfo) {
        if (message.byteLength < 8 || rinfo.address !== this.mx10IP)
            return;
        const size = message.readUInt16LE(0);
        const group = message.readUInt8(4);
        const commandAndMode = message.readUInt8(5);
        const command = commandAndMode >> 2;
        const mode = commandAndMode & 0x03;
        const nid = message.readUInt16LE(6);
        if (!this.mx10NID && (group !== 0x1a || command !== 0x06 || mode !== MsgMode.ACK))
            return;
        if (this.mx10NID && nid !== this.mx10NID) {
            if ((nid >> 8 !== 0xc0)) {
                if (!(group === 0xa && command === 0 && mode === MsgMode.EVT))
                    this.logInfo.next('Not from MX10: ' + JSON.stringify(message));
            }
            return;
        }
        const buffer = message.slice(8);
        this.printReadout(group, command, mode, nid, size, buffer, false);
        try {
            switch (group) {
                case 0x00:
                    this.systemControl.parse(size, command, mode, nid, buffer);
                    break;
                case 0x01:
                    this.accessory.parse(size, command, mode, nid, buffer);
                    break;
                case 0x02:
                    this.vehicle.parse(size, command, mode, nid, buffer);
                    break;
                case 0x05:
                    this.trainControl.parse(size, command, mode, nid, buffer);
                    break;
                case 0x06:
                case 0x16:
                    this.trackCfg.parse(size, command, mode, nid, buffer);
                    break;
                case 0x07:
                    this.data.parse(size, command, mode, nid, buffer);
                    break;
                case 0x08:
                    this.info.parse(size, command, mode, nid, buffer);
                    break;
                case 0x09:
                    this.propertyConfig.parse(size, command, mode, nid, buffer);
                    break;
                case 0x0a:
                    this.network.parse(size, command, mode, nid, buffer);
                    break;
                case 0x0b:
                    this.railwayControl.parse(size, command, mode, nid, buffer);
                    break;
                case 0x0c:
                    this.zimoProgrammableScript.parse(size, command, mode, nid, buffer);
                    break;
                case 0x0e:
                    this.fileControl.parse(size, command, mode, nid, buffer);
                    break;
                case 0x0f:
                    this.fileTransfer.parse(size, command, mode, nid, buffer);
                    break;
                case 0x12:
                    this.lanLocoState.parse(size, command, mode, nid, buffer);
                    break;
                case 0x17:
                    this.lanData.parse(size, command, mode, nid, buffer);
                    break;
                case 0x18:
                    this.lanInfo.parse(size, command, mode, nid, buffer);
                    break;
                case 0x1a:
                    this.lanNetwork.parse(size, command, mode, nid, buffer);
                    break;
                case 0x1c:
                    this.lanZimoProgrammableScript.parse(size, command, mode, nid, buffer);
                    break;
                case 0x2f:
                    break;
                default:
                    this.logInfo.next('Zcan group ' + group + ' not parsed: ' + JSON.stringify(message));
            }
        }
        catch (err) {
            this.logError.next('failed to parse zcan message: ' + JSON.stringify(message));
            if (err.message)
                this.logError.next(err.message);
        }
    }
    printReadout(group, cmd, mode, nid, size, raw_data, out = true) {
        if (this.debugCommunication) {
            const data = JSON.stringify(Array.apply([], [...raw_data]));
            const f = (obj) => Number(obj).toString(16);
            const arrow = '|' + (out ? '→' : '←');
            const msg = `${arrow} g=${f(group)} c=${f(cmd)} m=${f(mode)} n=${f(nid)} l=${f(size)} : ${data}`;
            this.logInfo.next(msg);
        }
    }
}
//# sourceMappingURL=MX10.js.map
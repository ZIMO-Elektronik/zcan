/* eslint-disable no-bitwise */

import {Buffer} from 'buffer';
import {interval, Subject} from 'rxjs';

import {
  AccessoryCommandGroup,
  DataGroup,
  FileControlGroup,
  FileTransferGroup,
  InfoGroup,
  LanDataGroup,
  LanInfoGroup,
  LanNetworkGroup,
  LanLocoStateGroup,
  LanZimoProgrammableScriptGroup,
  NetworkGroup,
  PropertyConfigGroup,
  RailwayControlGroup,
  SystemControlGroup,
  TrackCfgGroup,
  TrainControlGroup,
  VehicleGroup,
  ZimoProgrammableScriptGroup,
} from './zcan';
import {
  CreateSocketFunction,
  NIDGenerator,
  Socket,
  ZcanDataArray,
} from './@types/communication';
import {delay} from './internal/utils';
import ExtendedASCII from './util/extended-ascii';

/**
 *
 * @category Entrypoint
 */
export default class MX10 {
  myNID = 0;
  mx10NID = 0;
  mx10IP: string | undefined;
  connected = false;

  readonly systemControl = new SystemControlGroup(this);
  readonly accessoryCommand = new AccessoryCommandGroup(this);
  readonly vehicle = new VehicleGroup(this);
  readonly trainControl = new TrainControlGroup(this);
  readonly trackCfg = new TrackCfgGroup(this);
  readonly data = new DataGroup(this);
  readonly info = new InfoGroup(this);
  readonly propertyConfig = new PropertyConfigGroup(this);
  readonly network = new NetworkGroup(this);
  readonly railwayControl = new RailwayControlGroup(this);
  readonly zimoProgrammableScript = new ZimoProgrammableScriptGroup(this);
  readonly fileControl = new FileControlGroup(this);
  readonly fileTransfer = new FileTransferGroup(this);
  readonly lanInfo = new LanInfoGroup(this);
  readonly lanData = new LanDataGroup(this);
  readonly lanLocoState = new LanLocoStateGroup(this);
  readonly lanNetwork = new LanNetworkGroup(this);
  readonly lanZimoProgrammableScript = new LanZimoProgrammableScriptGroup(this);

  readonly errors = new Subject<string>();

  private mx10Socket: Socket | null = null;
  private incomingPort = 14521;
  private outgoingPort = 14520;

  private lastPing = 0;
  private interval: NodeJS.Timeout | undefined = undefined;

  private readonly nidGeneratorFunction: NIDGenerator;
  private readonly debugCommunication: boolean;
  private readonly reconnectionTime: number = 0;

  readonly connectionTimeout: number;

  constructor(
    nidGeneratorFunction: NIDGenerator,
    connectionTimeout = 1000,
    debugCommunication = false,
  ) {
    this.nidGeneratorFunction = nidGeneratorFunction;
    this.connectionTimeout = connectionTimeout;
    this.debugCommunication = debugCommunication;
    this.reconnectionTime = connectionTimeout * 4;

    const pingIntervalMs = 1000;

    if (this.connected) {
      this.network.ping();
    }
    interval(pingIntervalMs).subscribe(() => {
      if (this.connected) {
        this.network.ping();
      }
    });
  }

  async initSocket(
    createSocketFunction: CreateSocketFunction,
    ipAddress: string,
    incomingPort = 14521,
    outgoingPort = 14520,
  ) {
    this.mx10IP = ipAddress;
    this.incomingPort = incomingPort;
    this.outgoingPort = outgoingPort;

    if (this.mx10Socket == null) {
      const socket = (this.mx10Socket = createSocketFunction({
        type: 'udp4',
      }) as Socket);

      await new Promise((resolve) => {
        socket.bind(incomingPort, () => {
          resolve(null);
        });
      });

      this.mx10Socket.on('message', this.readRawData.bind(this));

      this.myNID = await this.nidGeneratorFunction();
      this.lanNetwork.portOpen();

      await delay(this.connectionTimeout);

      if (!this.connected) {
        this.closeSocket();
        throw new Error('mx10.connection.timeout');
      }
    }
  }

  reconnectLogic() {
    const date = Date.now();
    if (
      date - this.lastPing < this.reconnectionTime &&
      this.interval !== undefined
    ) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    if (this.interval === undefined) {
      this.interval = setInterval(() => {
        if (!this.connected) {
          // eslint-disable-next-line no-console
          console.log('Reconnecting...');
          this.network.portClose();
          this.lanNetwork.portOpen();
          this.network.ping(0b00);
        }
      }, this.reconnectionTime);
    }

    this.lastPing = date;
  }

  closeSocket(callMx10: boolean = true) {
    if (this.mx10Socket != null) {
      if (this.connected && callMx10) {
        this.network.portClose();
      }
      this.mx10Socket?.close();
      this.mx10Socket = null;
      this.connected = false;
    }
  }

  sendData(
    group: number,
    cmd: number,
    data: ZcanDataArray = [],
    mode = 0b01,
    nid = this.myNID,
    force = false,
  ) {
    const buffer = this.formatData(group, cmd, mode, nid, data);
    this.send(buffer, force);
  }

  private formatData(
    group: number,
    cmd: number,
    mode: number,
    nid: number,
    data: ZcanDataArray = [],
  ) {
    //Datagram Structure: Size(16) (Hex) (of Data), Unused(16) (Hex), Group(8) (Hex), Cmd+Mode(8) (command bit (Hex) shifted by mode (Binary)), NID(16) (Hex), Data(0...x) (Format: [{value: HEX, length: (1,2,4)}, {...}])

    const size = data.reduce((sum, obj) => sum + obj.length, 0);
    const buffer = Buffer.alloc(size + 8);

    const cmd_md = (cmd << 2) | mode;

    buffer.writeUInt16LE(size, 0);
    buffer.writeUInt16LE(0, 2); // unused
    buffer.writeUInt8(group, 4);
    buffer.writeUInt8(cmd_md, 5);
    buffer.writeUInt16LE(nid, 6);

    let offset = 8;

    data.forEach((element) => {
      if (typeof element.value === 'string') {
        ExtendedASCII.str2byte(element.value, buffer, offset, element.length);
        offset += element.length;
      } else {
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
            // eslint-disable-next-line no-console
            console.warn(`ELEMENT LENGTH NOT DEFINED, ${element}`);
        }
      }
    });

    this.printReadout(group, cmd, mode, nid, size, buffer.slice(8));

    return buffer;
  }

  private send(message: Buffer, force = false) {
    if (this.connected || force) {
      this.mx10Socket?.send(
        message,
        0,
        message.length,
        this.outgoingPort,
        this.mx10IP,
        (err) => {
          if (err && this.debugCommunication) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
        },
      );
    } else {
      this.errors.next('mx10.connection.not_connected');
    }
  }

  private readRawData(message: Buffer) {
    const size = message.readUInt16LE(0);
    const group = message.readUInt8(4);
    const commandAndMode = message.readUInt8(5);

    const command = commandAndMode >> 2;
    const mode = commandAndMode & 0x03;

    const nid = message.readUInt16LE(6);

    const buffer = message.slice(8); //Remove first 8 bytes; left only with data
    this.printReadout(group, command, mode, nid, size, buffer, false);

    switch (group) {
      case 0x00:
        this.systemControl.parse(size, command, mode, nid, buffer);
        break;
      case 0x01:
        this.accessoryCommand.parse(size, command, mode, nid, buffer);
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
      default:
        // eslint-disable-next-line no-console
        // console.warn('Unknown group: ' + Number(group).toString(16));
    }
  }

  private printReadout(
    group: number,
    cmd: number,
    mode: number,
    nid: number | undefined,
    size: number,
    raw_data: Buffer,
    out = true,
  ) {
    if (this.debugCommunication) {
      const data = JSON.stringify(Array.apply([], [...raw_data]));
      const f = (obj: unknown) => Number(obj).toString(16);
      const arrow = '|' + (out ? '→' : '←');

      // eslint-disable-next-line no-console
      console.debug(
        `${arrow} g=${f(group)} c=${f(cmd)} m=${f(mode)} n=${f(nid)} l=${f(
          size,
        )} : ${data}`,
      );
    }
  }
}

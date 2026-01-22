import {Buffer} from 'buffer';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {Message, Query} from '../@types/communication';
import {BidiInfoData, BidiDirectionData, ModInfoData} from '../@types/models';
import {BidiType, Direction, ForwardOrReverse, ModInfoType, MsgMode} from '../util/enums';

/**
 *
 * @category Groups
 */
export default class InfoGroup {
  private mx10: MX10;

  public readonly onBidiInfoChange = new Subject<BidiInfoData>();
  public readonly onModuleInfoChange = new Subject<ModInfoData>();

  private modInfoQ: Query<ModInfoData> | undefined = undefined;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  async getModuleInfo(nid: number, type: ModInfoType | number): Promise<ModInfoData | undefined>
  {
    if(this.modInfoQ !== undefined && !await this.modInfoQ.lock()) {
      this.mx10.log.next("mx10.getModuleInfo: failed to acquire lock");
      return undefined;
    }

    this.modInfoQ = new Query(ModInfoData.header(MsgMode.REQ, nid), this.onModuleInfoChange);
    this.modInfoQ.log = ((msg) => {
      this.mx10.log.next(msg);
    });
    this.modInfoQ.tx = ((header) => {
      const msg = new Message(header);
      msg.push({value: nid, length: 2});
      msg.push({value: type, length: 2});
      this.mx10.log.next('mx10 query tx: ' + JSON.stringify(msg));
      this.mx10.sendMsg(msg);
    });
    this.modInfoQ.match = ((msg) => {
      this.mx10.log.next('mx10 query rx: ' + JSON.stringify(msg));
      return (msg.type() === type);
    })
    // this.modInfoQ.subscribe();
    const rv = await this.modInfoQ.run();
    this.mx10.log.next("mx10.getModuleInfo.rv: " + JSON.stringify(rv));
    this.modInfoQ.unlock();
    this.modInfoQ = undefined;
    return rv;
  }

  parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x05:
        this.parseBidiInfo(size, mode, nid, buffer);
        break;
      case 0x08:
        this.parseModuleInfo(size, mode, nid, buffer);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('command not parsed: ' + command.toString());
    }
  }

  private parseModuleInfo(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    // const msgMode: MsgMode = mode as MsgMode;
    // this.mx10.log.next('parseModuleInfo: ' + msgMode);
    if (this.onModuleInfoChange.observed) {
      const NID = buffer.readUInt16LE(0);
      const type = buffer.readUInt16LE(2);
      const info = buffer.readUInt32LE(4);
      const msg = new ModInfoData(ModInfoData.header(mode, NID), type, [{value: info, length: 4}]);
      this.mx10.log.next('onModuleInfoChange <- ' + JSON.stringify(msg));
      this.onModuleInfoChange.next(msg);
    }
  }

  private parseBidiInfo(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    if (this.onBidiInfoChange.observed) {
      const NID = buffer.readUInt16LE(0);
      const type = buffer.readUInt16LE(2);
      const info = buffer.readUInt32LE(4);

      let data: BidiDirectionData | number = {};
      switch (type) {
        case BidiType.DIRECTION:
          data.direction = this.parseEastWest(info);
          data.directionChange = this.parseDirChange(info);
          data.directionConfirm = this.parseDirectionConfirm(info);
          data.forwardOrReverse = this.parseFwdRev(info);
          break;
        default:
          data = info;
      }

      this.onBidiInfoChange.next({
        nid: NID,
        type,
        data,
      });
    }
  }

  private parseEastWest(data: number) {
    if ((data & 0x02) == 0x02) {
      return Direction.EAST;
    } else {
      return Direction.WEST;
    }
  }

  private parseDirChange(data: number) {
    return (data & 0x04) == 0x04;
  }

  private parseFwdRev(data: number) {
    if ((data & 0x01) == 0) {
      return ForwardOrReverse.REVERSE;
    } else {
      return ForwardOrReverse.FORWARD;
    }
  }
  private parseDirectionConfirm(data: number) {
    return (data & 0x08) == 0x08;
  }
}

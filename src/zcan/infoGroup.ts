import {Buffer} from 'buffer';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import {BidiInfoData, BidiData} from '../@types/models';
import {BidiType, Direction, ForwardOrReverse} from 'src/util/enums';

/**
 *
 * @category Groups
 */
export default class InfoGroup {
  private mx10: MX10;

  public readonly onBidiInfoChange = new Subject<BidiInfoData>();

  constructor(mx10: MX10) {
    this.mx10 = mx10;
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
      default:
        // eslint-disable-next-line no-console
        console.log('command not parsed: ' + command.toString());
    }
  }

  private parseBidiInfo(
    size: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    const NID = buffer.readUInt16LE(0);
    const type = buffer.readUInt16LE(2);
    const info = buffer.readUInt32LE(4);

    const data: BidiData = {};
    switch (type) {
      case BidiType.SPEED_REPORT:
        data.speed = info;
        break;
      case BidiType.DIRECTION:
        data.direction = this.parseEastWest(info);
        data.directionChange = this.parseDirChange(info);
        data.directionConfirm = this.parseDirectionConfirm(info);
        data.forwardOrReverse = this.parseFwdRev(info);
    }

    this.onBidiInfoChange.next({
      nid: NID,
      type,
      data,
    });
  }

  parseEastWest(data: number) {
    if ((data & 0x02) == 0x02) {
      return Direction.WEST;
    } else {
      return Direction.EAST;
    }
  }

  parseDirChange(data: number) {
    return (data & 0x04) == 0x04;
  }

  parseFwdRev(data: number) {
    if ((data & 0x01) == 0) {
      return ForwardOrReverse.FORWARD;
    } else {
      return ForwardOrReverse.REVERSE;
    }
  }
  parseDirectionConfirm(data: number) {
    return (data & 0x08) == 0x08;
  }
}

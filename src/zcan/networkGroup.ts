// 0x0A
import {Subject} from 'rxjs';
import MX10 from '../MX10';
import {Buffer} from 'buffer';
import {PingResponseExtended} from 'src/@types/models';

/**
 *
 * @category Groups
 */
export default class NetworkGroup {
  public readonly onPingResponse = new Subject<PingResponseExtended>();

  private mx10: MX10;
  pingTimeout: NodeJS.Timeout | null = null;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  ping(mode = 0b10) {
    this.mx10.sendData(
      0x0a,
      0x00,
      [
        {
          value: this.mx10.mx10NID,
          length: 2,
        },
      ],
      mode,
    );
  }

  portClose() {
    this.mx10.sendData(0x0a, 0x07, [{value: this.mx10.myNID, length: 2}], 0b01);
  }

  parse(
    size: number,
    command: number,
    mode: number,
    nid: number,
    buffer: Buffer,
  ) {
    switch (command) {
      case 0x00:
        this.pingResponse(size, mode, nid, buffer);
        break;
    }
  }

  // 0x0A.0x00
  pingResponse(size: number, mode: number, nid: number, _buffer: Buffer) {
    if (this.onPingResponse.observed) {
      if (size === 8) {
        // TODO IMPLEMENT DETAIL READOUT

        if (!this.mx10.mx10NID) {
          this.mx10.mx10NID = nid;
        }
        this.mx10.connected = true;

        // TODO reconnect when uuid has changed
        // const uuid = buffer.readUInt32LE(0);

        this.mx10.reconnectLogic();

        if (this.pingTimeout) {
          clearTimeout(this.pingTimeout);
        }

        this.pingTimeout = setTimeout(() => {
          this.mx10.connected = false;
          this.onPingResponse.next({
            connected: this.mx10.connected,
          });
          // eslint-disable-next-line no-console
          console.log('No ping for 5 seconds, disconnected');
        }, 5000);
      } else {
        throw new Error(
          'LENGTH ERROR: readCmdGrp_0x0A-0x0A, read length as: ' +
            size.toString(),
        );
      }

      this.onPingResponse.next({
        connected: this.mx10.connected,
      });
    }
  }
}

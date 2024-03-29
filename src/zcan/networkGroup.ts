// 0x0A
import MX10 from '../MX10';
import {Buffer} from 'buffer';

/**
 *
 * @category Groups
 */
export default class NetworkGroup {
  private mx10: MX10;

  constructor(mx10: MX10) {
    this.mx10 = mx10;
  }

  ping(mode = 0b01) {
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
    if (size === 8) {
      // TODO IMPLEMENT DETAIL READOUT

      if (!this.mx10.mx10NID) {
        this.mx10.mx10NID = nid;
      }
      this.mx10.connected = true;

      // TODO reconnect when uuid has changed
      // const uuid = buffer.readUInt32LE(0);

      this.mx10.reconnectLogic();

      //Return Ping ACK
      if (!this.mx10.connected) {
        this.ping(0b11);
      }
    } else {
      //Error

      throw new Error(
        'LENGTH ERROR: readCmdGrp_0x0A-0x0A, read length as: ' +
          size.toString(),
      );
    }
  }
}

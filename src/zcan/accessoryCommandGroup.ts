/* eslint-disable @typescript-eslint/no-unused-vars */
import MX10 from '../MX10';

/**
 *
 * @category Groups
 */
export default class AccessoryCommandGroup {
  private mx10: MX10;

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
    // console.log('parse accessory command group');
  }
}

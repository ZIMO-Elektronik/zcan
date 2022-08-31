/* eslint-disable @typescript-eslint/no-unused-vars */
import {Buffer} from 'buffer';
import MX10 from '../MX10';

/**
 *
 * @category Groups
 */
export default class RailwayControlGroup {
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
    // console.log('parse railway control group');
  }
}

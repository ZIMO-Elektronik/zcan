import {createSocket} from 'dgram';
import MX10 from '../../src';

export function createMX10(debug?: boolean) {
  return new MX10(
    () => new Promise((resolve) => resolve(23)),
    1000,
    debug || false,
  );
}

export function initConnection(mx10: MX10) {
  return mx10.initSocket(createSocket, '192.168.1.145');
}

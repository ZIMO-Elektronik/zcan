import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, describe, it, expect} from '@jest/globals';

describe('LAN Data group tests - 0x16', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    mx10.closeSocket();
  });

  it('0x08 - Tse Prog Read Extended', (done) => {
    mx10.trackCfg.tseProgRead(211, 8);

    const prog = mx10.trackCfg.onTseProgReadExtended.subscribe((data) => {
      expect(data.cfgNum).toBeDefined();
      expect(data.cfgNum).toBe(8);
      expect(data.cvValue).toBeDefined();
      expect(data.cvValue).toBe(145);

      prog.unsubscribe();
      done();
    });
  });

  it('0x09 - Tse Prog Write Extended', (done) => {
    // Please be sure if you want to CV write HU value on test
    // mx10.trackCfg.tseProgWrite(211, 51, 20);

    const prog = mx10.trackCfg.onTseProgWriteExtended.subscribe((data) => {
      expect(data.cfgNum).toBeDefined();
      expect(data.cfgNum).toBe(51);
      expect(data.cvValue).toBeDefined();
      expect(data.cvValue).toBe(20);

      prog.unsubscribe();
      done();
    });
  });
});

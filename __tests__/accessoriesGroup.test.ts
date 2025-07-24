import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, describe, expect, it} from '@jest/globals';
import {AccessoryMode, AccessoryPortState} from '../src';

describe('Accessories group tests - 0x01', () => {
  const mx10 = createMX10(true);
  const nid = 0x300a; // nid:10

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    mx10.closeSocket();
  });

  it('0x01 - Accessory Mode test', () => {
    mx10.accessoryCommand.accessoryModeByNid(nid);

    const test = mx10.accessoryCommand.onAccessoryMode.subscribe((data) => {
      expect(data.nid).toBe(nid);
      expect(data.mode).toBeDefined();
      expect(data.mode).toBe(AccessoryMode.PAIRED);

      test.unsubscribe();
    });
  });

  it('0x02 - Accessory Port test', async () => {
    mx10.accessoryCommand.accessoryPortByNid(nid);

    const test = mx10.accessoryCommand.onAccessoryPort.subscribe((data) => {
      expect(data.nid).toBe(nid);
      expect(data.port).toBeDefined();

      test.unsubscribe();
    });
  });
});

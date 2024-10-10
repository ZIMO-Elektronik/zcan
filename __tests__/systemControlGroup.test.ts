import {afterAll, beforeAll, describe, expect, jest} from '@jest/globals';
import {createMX10, initConnection} from './util';
import {SystemStateData, SystemStateMode} from '../src';
import {delay} from '../src/internal/utils';

describe('System Control Group group tests - 0x00', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    mx10.systemControl.systemState(SystemStateMode.NORMAL);

    delay(1000).then(() => {
      mx10.closeSocket();
    });
  });

  test.each<{mode: number}>([
    {mode: SystemStateMode.SSPe},
    {mode: SystemStateMode.OFF},
    {mode: SystemStateMode.SSP0},
  ])('0x00 - System state test', ({mode}, done) => {
    mx10.systemControl.systemState(mode);

    const callback = jest.fn((data: SystemStateData) => {
      if (data.nid === mx10.mx10NID) {
        expect(data.port).toBeDefined();
        expect(data.mode).toBe(mode);

        if (callback.mock.calls.length === 3) {
          sub.unsubscribe();
          done();
        }
      }
    });

    const sub = mx10.systemControl.onSystemStateChange.subscribe(callback);
  });
});

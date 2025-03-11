import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, expect, it} from '@jest/globals';
import {firstValueFrom} from 'rxjs';
import {delay} from '../src/internal/utils';

describe('LocoState group tests - 0x12', () => {
  const mx10 = createMX10();
  const testNID = 3;

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    delay(1000).then(() => {
      mx10.closeSocket();
    });
  });

  it('0x00 - retrieve loco state', async () => {
    const data = await firstValueFrom(mx10.lanLocoState.onLocoStateExtended);

    expect(data.nid).toBe(testNID);
    // testing on device ZimoApp
    expect(data.ownerNid).toBe(mx10.myNID);
  });
});

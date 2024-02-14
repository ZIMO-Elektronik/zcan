import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, describe, it, expect} from '@jest/globals';
import {firstValueFrom} from 'rxjs';
import {
  DataValueExtendedData,
  LocoSpeedTabExtended,
  OperatingMode,
  Train,
} from '../src';

describe('LAN Data group tests - 0x17', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    mx10.closeSocket();
  });

  it('0x27 - Loco GUI eXtended', async () => {
    mx10.lanData.locoGuiExtended(3);

    const train: Train = await firstValueFrom(mx10.lanData.onLocoGuiExtended);
    expect(train).toBeDefined();
    expect(train.nid).toBe(3);
    expect(train.name).toMatch('Franz');
    expect(train.era).toBeDefined();
    expect(train.functions).toBeDefined();
  });

  it('0x19 - Loco Speed Tab eXtended', async () => {
    mx10.lanData.locoSpeedTapExtended(211);

    const locoSpeedTab: LocoSpeedTabExtended = await firstValueFrom(
      mx10.lanData.onLocoSpeedTabExtended,
    );
    expect(locoSpeedTab).toBeDefined();
    expect(locoSpeedTab.nid).toBe(211);
    expect(locoSpeedTab.dbat6).toBe(3);
    expect(locoSpeedTab.speedTab).toBeDefined();
    // expect(train.era).toBeDefined();
    // expect(train.functions).toBeDefined();
  });

  it('0x8 - Data Value eXtended', async () => {
    mx10.lanData.dataValueExtended(211);

    const data: DataValueExtendedData = await firstValueFrom(
      mx10.lanData.onDataValueExtended,
    );

    expect(data).toBeDefined();
    expect(data.nid).toBe(211);
    expect(data.functionCount).toBeDefined();
    expect(data.operatingMode).toBeDefined();
    expect(data.operatingMode).toBe(OperatingMode.DCC);
    expect(data.speedStep).toBeDefined();
    expect(data.forward).toBeDefined();
    expect(data.emergencyStop).toBeDefined();
    expect(data.functionsStates).toBeDefined();
    expect(data.flags.deleted).toBe(false);
  });
});

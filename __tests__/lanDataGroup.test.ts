import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, describe, it, expect} from '@jest/globals';
import {firstValueFrom} from 'rxjs';
import {
  DataValueExtendedData,
  LocoGuiMXExtended,
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
    mx10.lanData.locoGuiExtended(211);

    const train: Train = await firstValueFrom(mx10.lanData.onLocoGuiExtended);
    expect(train).toBeDefined();
    expect(train.nid).toBe(211);
    // expect(train.name).toMatch('import loco');
    expect(train.era).toBeDefined();
    expect(train.functions).toBeDefined();
  });

  it('0x28 - Loco GUI MX eXtended', async () => {
    mx10.lanData.locoGuiMXExtended(211);

    const train: LocoGuiMXExtended = await firstValueFrom(
      mx10.lanData.onLocoGuiMXExtended,
    );
    expect(train).toBeDefined();
    expect(train.nid).toBe(211);
    expect(train.functions).toBeDefined();
  });

  it('0x19 - Loco Speed Tab eXtended', async () => {
    mx10.lanData.locoSpeedTapExtended(9999);

    const locoSpeedTab: LocoSpeedTabExtended = await firstValueFrom(
      mx10.lanData.onLocoSpeedTabExtended,
    );
    expect(locoSpeedTab).toBeDefined();
    expect(locoSpeedTab.nid).toBe(9999);
    expect(locoSpeedTab.dbat6).toBe(4);
    expect(locoSpeedTab.speedTab).toBeDefined();

    // mx10.sendData(0x02, 0x01, [{value: 56, length: 2}]);
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

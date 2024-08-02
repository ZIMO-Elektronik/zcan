import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, expect, it} from '@jest/globals';
import {firstValueFrom} from 'rxjs';
import {delay} from '../src/internal/utils';
import {
  Direction,
  DirectionDefault,
  Manual,
  OperatingMode,
  ShuntingFunction,
  SpecialFunctionMode,
} from '../src';

describe('Vehicle group tests - 0x02', () => {
  const mx10 = createMX10();
  const testNID = 211;

  beforeAll(async () => {
    await initConnection(mx10);
  });

  afterAll(() => {
    mx10.vehicle.changeSpeed(testNID, 0, true);

    delay(1000).then(() => {
      mx10.closeSocket();
    });
  });

  it('0x00 - retrieve operating state', async () => {
    const data = await firstValueFrom(mx10.vehicle.onVehicleState);

    expect(data.nid).toBe(211);
    // testing on device ZimoApp
    expect(data.ctrlDevice).toBe(0);
  });

  it('0x01 - retrieve operating mode', async () => {
    mx10.vehicle.vehicleMode(3);
    const data = await firstValueFrom(mx10.vehicle.onVehicleMode);

    expect(data.nid).toBe(3);

    expect(data.nid).toBe(3);
    expect(data.operatingMode).toBe(OperatingMode.DCC);
  });

  test.each([
    {nid: testNID, speedStep: 10, forward: true, eastWest: Direction.UNDEFINED},
    {nid: testNID, speedStep: 30, forward: false, eastWest: Direction.EAST},
    {nid: testNID, speedStep: 40, forward: false, eastWest: Direction.WEST},
    {nid: testNID, speedStep: 35, forward: true, eastWest: Direction.WEST},
  ])(
    '0x02 - change speed and directions',
    async ({nid, speedStep, forward, eastWest}) => {
      mx10.vehicle.changeSpeed(nid, speedStep, forward, eastWest);

      const data = await firstValueFrom(mx10.vehicle.onChangeSpeed);
      expect(data).toBeDefined();
      expect(data.nid).toBe(nid);
      expect(data.divisor).toBe(0);

      expect(data.speedStep).toBe(speedStep);
      expect(data.forward).toBe(forward);
      expect(data.eastWest).toBe(eastWest);
      expect(data.emergencyStop).toBe(false);
    },
  );

  it('0x02 - change speed with bidi feedback', (done) => {
    const speedStep = 500,
      forward = true;

    const sub = mx10.info.onBidiInfoChange.subscribe((data) => {
      if (data.type === 0x0100) {
        expect(data).toBeDefined();
        expect(data.type).toBe(0x0100);
        expect(data.data).toBeGreaterThan(10);

        sub.unsubscribe();
        done();
      }
    });

    mx10.vehicle.changeSpeed(testNID, speedStep, forward);
  });

  it('0x04 - call function', async () => {
    const nid = testNID,
      buttonId = 1;

    mx10.vehicle.callFunction(nid, buttonId, true);
    const data = await firstValueFrom(mx10.vehicle.onCallFunction);

    expect(data).toBeDefined();
    expect(data.nid).toBe(nid);
    expect(data.functionNumber).toBe(buttonId);
    expect(data.functionState).toBe(true);

    await delay(500);

    mx10.vehicle.callFunction(nid, buttonId, false);
    const data2 = await firstValueFrom(mx10.vehicle.onCallFunction);

    expect(data2).toBeDefined();
    expect(data2.nid).toBe(nid);
    expect(data2.functionNumber).toBe(buttonId);
    expect(data2.functionState).toBe(false);
  });

  test.each([
    {mode: SpecialFunctionMode.MANUAL, state: Manual.OFF},
    {mode: SpecialFunctionMode.SHUNTING_FUNCTION, state: ShuntingFunction.AZBZ},
    {
      mode: SpecialFunctionMode.DIRECTION_DEFAULT,
      state: DirectionDefault.DIRECTION_WEST,
    },
  ])('0x05 - special function mode', async ({mode, state}) => {
    mx10.vehicle.changeSpecialFunction(testNID, mode, state);
    const data = await firstValueFrom(mx10.vehicle.onCallSpecialFunction);

    expect(data).toBeDefined();
    expect(data.nid).toBe(testNID);
    expect(data.specialFunctionMode).toBe(mode);
    expect(data.specialFunctionState).toBe(state);
  });
});

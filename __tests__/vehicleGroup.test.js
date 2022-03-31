import {createMX10, initConnection} from "./util/index.js";
import {afterAll, beforeAll, expect, it} from "@jest/globals";
import {firstValueFrom} from "rxjs";
import {delay} from '../src/util/utils';

const combineSpeedAndDirection = (speed, forward, eastWest, emergencyStop = false) => {
  const direction = Number(forward);
  const sideways = eastWest === undefined ? 0 : eastWest ? 1 : 2;
  const stop = Number(emergencyStop);

  return speed | (direction << 10) | (sideways << 12) | (stop << 15);
};

const parseSpeed = (speedAndDirection) => {
  const speedBites____ = 0b0000001111111111;
  const directionBites = 0b0000010000000000;
  const directACKBites = 0b0000100000000000;
  const eastWestBites_ = 0b0011000000000000;

  const speedStep = speedAndDirection & speedBites____;
  const direction = (speedAndDirection & directionBites) === directionBites;
  const directionACK = (speedAndDirection & directACKBites) === directACKBites;
  const sideways = speedAndDirection & eastWestBites_;

  const forward = direction || directionACK;
  const eastWest = sideways === 1 ? true : sideways === 2 ? false : undefined;

  return {
    speedStep,
    forward,
    eastWest,
  };
}

describe('Vehicle group tests - 0x02', () => {
  const mx10 = createMX10();
  const speedTestData = [
    {nid: 3, speedStep: 10, forward: true, eastWest: undefined},
    {nid: 3, speedStep: 30, forward: false, eastWest: true},
    {nid: 3, speedStep: 40, forward: false, eastWest: false},
  ];

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.vehicle.changeSpeed(3, combineSpeedAndDirection(0, true, undefined))

    mx10.closeSocket();
  })

  test.each(speedTestData)("0x02 - change speed and directions", async ({nid, speedStep, forward, eastWest}) => {

    const speedAndDirection = combineSpeedAndDirection(speedStep, forward, eastWest);
    mx10.vehicle.changeSpeed(nid, speedAndDirection);

    const data = await firstValueFrom(mx10.vehicle.onChangeSpeed);
    expect(data).toBeDefined();
    expect(data.nid).toBe(nid);
    expect(data.divisor).toBe(0);

    const speed = parseSpeed(data.speedAndDirection);

    expect(speed.speedStep).toBe(speedStep);
    expect(speed.forward).toBe(forward);
    expect(speed.eastWest).toBe(eastWest);
  })

  it("0x02 - change speed with bidi feedback", (done) => {
    const nid = speedTestData[0].nid, speedStep = 500, forward = true;

    const speedAndDirection = combineSpeedAndDirection(speedStep, forward, undefined);
    mx10.vehicle.changeSpeed(nid, speedAndDirection);

    delay(1000).then(() => {
      const sub = mx10.info.onBidiInfoChange.subscribe((data) => {
        if (data.type === 0x0100) {
          expect(data).toBeDefined();
          expect(data.type).toBe(0x0100);
          expect(data.data).toBeGreaterThan(10);

          sub.unsubscribe();
          done()
        }
      });
    });
  })

  it("0x04 - call function", async () => {
    const nid = speedTestData[0].nid, buttonId = 1;

    mx10.vehicle.callFunction(nid, buttonId, true);
    const data = await firstValueFrom(mx10.vehicle.onCallFunction);

    expect(data).toBeDefined();
    expect(data.nid).toBe(nid);
    expect(data.functionNumber).toBe(buttonId);
    expect(data.functionState).toBe(1);

    await delay(500);

    mx10.vehicle.callFunction(nid, buttonId, false);
    const data2 = await firstValueFrom(mx10.vehicle.onCallFunction);

    expect(data2).toBeDefined();
    expect(data2.nid).toBe(nid);
    expect(data2.functionNumber).toBe(buttonId);
    expect(data2.functionState).toBe(0);
  })
});

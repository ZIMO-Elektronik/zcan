import {createMX10, initConnection} from "./util/index.js";
import {afterAll, beforeAll, expect, it} from "@jest/globals";
import {firstValueFrom} from "rxjs";
import {combineSpeedAndDirection, parseSpeed} from "../src/util/speedUtils.js";
import {delay} from "../src/internal/utils"

describe('Vehicle group tests - 0x02', () => {
  const mx10 = createMX10();
  const testNID = 3;

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.vehicle.changeSpeed(testNID, combineSpeedAndDirection(0, true, undefined))

    delay(1000).then(() => {
    mx10.closeSocket();
    })
  })

  test.each([
    {nid: testNID, speedStep: 10, forward: true, eastWest: undefined},
    {nid: testNID, speedStep: 30, forward: false, eastWest: true},
    {nid: testNID, speedStep: 40, forward: false, eastWest: false},
  ])("0x02 - change speed and directions", async ({nid, speedStep, forward, eastWest}) => {

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
    const nid = testNID, speedStep = 500, forward = true;

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
    const nid = testNID, buttonId = 1;

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

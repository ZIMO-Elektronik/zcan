import {afterAll, beforeAll, describe, expect, jest} from "@jest/globals";
import {createMX10, initConnection} from "./util/index.js";
import {SystemStateMode} from "../src/index.js";
import {delay} from "../src/internal/utils";

describe('System Control Group group tests - 0x00', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.systemControl.systemState(SystemStateMode.NORMAL);

    delay(1000).then(() => {
      mx10.closeSocket();
    });
  })


  test.each([
    SystemStateMode.SSPe, SystemStateMode.OFF, SystemStateMode.SSP0,
  ])("0x00 - System state test", (mode, done) => {
    mx10.systemControl.systemState(mode);

    const callback = jest.fn(function(data) {
      if (data.nid === mx10.mx10NID) {
        expect(data.port).toBeDefined();
        expect(data.mode).toBe(mode);
        this.counter++;

        if (this.counter === 3) {
          sub.unsubscribe();
          done();
          expect(callback.mock.calls).toBe(3);
        }
      }
    }.bind({counter: 0}));

    const sub = mx10.systemControl.onSystemStateChange.subscribe(callback);
  })
})

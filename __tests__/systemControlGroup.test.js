import {afterAll, beforeAll, describe} from "@jest/globals";
import {createMX10, initConnection} from "./util/index.js";
import {SystemStateModes} from "../src/util/enums.js";

describe('System Control Group group tests - 0x18', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket();
  })


  test.each([
    SystemStateModes.SSPe, SystemStateModes.OFF, SystemStateModes.SSP0, SystemStateModes.NORMAL
  ])("0x00 - System state test", (mode, done) => {
    mx10.systemControl.systemState(mode);

    const sub = mx10.systemControl.onSystemStateChange.subscribe((data) => {
      if (data.nid === mx10.mx10NID) {
        expect(data.port).toBe(128) // boosters are first to respond
        expect(data.mode).toBe(mode);

        sub.unsubscribe();
        done();
      }
    });
  })
})

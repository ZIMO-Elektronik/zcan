import {createMX10, initConnection} from "./util/index.js";
import {afterAll, beforeAll, expect, it} from "@jest/globals";

describe('Info group tests - 0x08', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket();
  })

  it("0x05 - Bidi info - train speed", (done) => {

    const sub = mx10.info.onBidiInfoChange.subscribe((data) => {
      if (data.type === 0x0100) {

        expect(data.nid).toBe(3);
        expect(data.data).toBeDefined();
        expect(data.data).toBeGreaterThanOrEqual(0);

        done();
        sub.unsubscribe();
      }
    });
  });

});

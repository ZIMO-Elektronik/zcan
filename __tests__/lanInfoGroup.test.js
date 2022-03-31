import {createMX10, initConnection} from "./util/";
import {afterAll, beforeAll, it, describe, expect} from "@jest/globals";
import {firstValueFrom} from "rxjs";

describe('LAN Info group tests - 0x18', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket();
  })

  it("0x00 - module power info", (done) => {
    const sub = mx10.lanInfo.onModulePowerInfo.subscribe((data) => {
      if (data.deviceNID === mx10.mx10NID) {

        expect(data.port1Status).toBeDefined();
        expect(data.port1Voltage).toBeDefined();
        expect(data.port1Amperage).toBeDefined();
        expect(data.port2Status).toBeDefined();
        expect(data.port2Voltage).toBeDefined();
        expect(data.port2Amperage).toBeDefined();
        expect(data.amperage32V).toBeDefined();
        expect(data.amperage12V).toBeDefined();
        expect(data.voltageTotal).toBeDefined();
        expect(data.temperature).toBeDefined();

        sub.unsubscribe();
        done();
      }
    })
  })

});

import {createMX10, initConnection} from "./util";
import {afterAll, beforeAll, describe, it, expect} from "@jest/globals";
import {firstValueFrom} from "rxjs";
import {DataValueExtendedData, OperatingMode, Train} from "../src";

describe('LAN Data group tests - 0x17', () => {
  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket();
  })

  it("0x27 - Loco GUI eXtended", async () => {
    mx10.lanData.locoGuiExtended(3);

    const train: Train = await firstValueFrom(mx10.lanData.onLocoGuiExtended)
    expect(train).toBeDefined();
    expect(train.nid).toBe(3);
    expect(train.name).toMatch(/dodo1.*/)
    expect(train.era).toBeDefined();
    expect(train.functions).toBeDefined();
  })

  it("0x8 - Data Value eXtended", async () => {
    mx10.lanData.dataValueExtended(3);

    const data: DataValueExtendedData = await firstValueFrom(mx10.lanData.onDataValueExtended)

    expect(data).toBeDefined();
    expect(data.nid).toBe(3);
    expect(data.functionCount).toBeDefined();
    expect(data.operatingMode).toBeDefined();
    expect(data.operatingMode).toBe(OperatingMode.DCC)
    expect(data.speedStep).toBeDefined();
    expect(data.forward).toBeDefined();
    expect(data.emergencyStop).toBeDefined();
    expect(data.functionsStates).toBeDefined();
  })
});

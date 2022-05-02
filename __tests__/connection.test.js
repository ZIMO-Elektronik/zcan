import {createSocket} from "dgram";
import {afterAll, beforeAll, it, jest, describe, expect} from "@jest/globals";
import {createMX10, initConnection} from "./util";

describe('High level tests', () => {
  const mx10 = createMX10(true);
  const debug = global.console.debug;

  beforeAll(() => {
    global.console.debug = jest.fn();
  })

  afterAll(() => {
    mx10.closeSocket();
    global.console.debug = debug;
  })

  it("Correct url test", async () => {
    expect(mx10.connected).toBe(false);

    await initConnection(mx10);
    expect(mx10.connected).toBe(true);

    mx10.closeSocket();
    expect(mx10.connected).toBe(false);
  });

  it("Incorrect url test", async () => {
    expect(mx10.connected).toBe(false);
    const res = mx10.initSocket(createSocket, "192.168.2.145");
    await expect(res).rejects.toThrow('mx10.connection.timeout')

    expect(mx10.connected).toBe(false);
  });

  it("Error logger test", () => {
    mx10.network.ping();

    mx10.errors.subscribe((error) => {
      expect(error).toBe('connection.not_connected')
    })
  })

  it("Incorrect data format", () => {
    expect(() => {
      mx10.sendData(0x00, 0x00, [
        {length: 1, value: 1,},
        {length: 4, value: 1234,},
        {length: 8, value: 0,}
      ])
    }).toThrow(/ELEMENT LENGTH NOT DEFINED.*/)
  })
});

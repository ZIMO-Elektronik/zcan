import {createSocket} from "dgram";
import {afterAll, beforeAll, it, jest, describe, expect} from "@jest/globals";
import {createMX10, initConnection} from "./util";

describe('High level tests', () => {
  const mx10 = createMX10(true);
  const debug = global.console.debug;

  afterEach(() => {
    mx10.closeSocket()
  })

  beforeAll(() => {
    global.console.debug = jest.fn();
  })

  afterAll(() => {
    global.console.debug = debug;
  })

  it("Correct url test", async () => {
    expect(mx10.connected).toBe(false);

    return initConnection(mx10).then(() => {
        expect(mx10.connected).toBe(true);

        mx10.closeSocket();
        expect(mx10.connected).toBe(false);
    })
  });

  it("Incorrect url test", async () => {
    expect(mx10.connected).toBe(false);
    const res = mx10.initSocket(createSocket, "192.168.2.145");
    await expect(res).rejects.toThrow('mx10.connection.timeout')

    expect(mx10.connected).toBe(false);
  });

  it("Error logger test", (done) => {
    mx10.errors.subscribe((error: string) => {
      expect(error).toBe('mx10.connection.not_connected')
      done();
    })

    mx10.network.ping();
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

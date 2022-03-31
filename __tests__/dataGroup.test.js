import {createMX10, initConnection} from "./util/index.js";
import {afterAll, beforeAll, it, describe, expect} from "@jest/globals";
import {firstValueFrom} from "rxjs";

describe('Data group tests - 0x07', () => {

  const mx10 = createMX10();

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket();
  })

  it("0x00 - Group count test", (done) => {
    mx10.data.groupCount();

    const sub = mx10.data.onGroupCount.subscribe((data) => {
      if (data.objectType === 0x0000) {

        expect(data.objectType).toBe(0x000);
        expect(data.number).toBe(49);

        done();
        sub.unsubscribe();
      }
    });
  });

  it("0x01 - List item by index test", async () => {
    mx10.data.listItemsByIndex(0x0000, 3);

    const data = await firstValueFrom(mx10.data.onListItemsByIndex);

    expect(data.index).toBe(3);
    expect(data.nid).toBe(4);

  });

  it("0x02 - List item by nid test", async () => {
    mx10.data.listItemsByNID(3);

    const data = await firstValueFrom(mx10.data.onListItemsByNID);
    expect(data.nid).toBe(4);
    expect(data.index).toBe(3);
  });

});

import {createMX10, initConnection} from "./util";
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

		const sub = mx10.info.onBidiInfoChange.subscribe((msg) => {
			if (msg.type() === 0x0100) {

				expect(msg.nid()).toBe(3);
				expect(msg.info()).toBeDefined();
				expect(msg.info()).toBeGreaterThanOrEqual(0);

				done();
				sub.unsubscribe();
			}
		});
	});

});

import {createMX10, initConnection} from './util';
import {afterAll, beforeAll, describe, expect, it} from '@jest/globals';
import {firstValueFrom} from 'rxjs';
import {FxConfigType, ImageType, NameType} from '../src';

describe('Data group tests - 0x07', () => {
	const mx10 = createMX10(true);

	beforeAll(async () => {
		await initConnection(mx10);
	});

	afterAll(() => {
		mx10.closeSocket();
	});

	it('0x00 - Group count test',  async () => {
		const msg = await mx10.data.groupCount();
		expect(msg).toBeDefined();
		expect(msg?.group()).toBe(0x0000);
		expect(msg?.count()).toBeDefined();
	});

	it('0x01 - List item by index test', async () => {
		const msg = await mx10.data.listItemsByIndex(0x0000, 3);

		expect(msg).toBeDefined();
		expect(msg?.index()).toBe(3);
		expect(msg?.itemNid()).toBe(4);
	});

	it('0x02 - List item by nid test', async () => {
		mx10.data.listItemsByNID(3);

		const data = await firstValueFrom(mx10.data.onListItemsByNID);
		expect(data.nid).toBe(65535);
		expect(data.index).toBe(65535);
	});

	it('0x1f - Remove locomotive with nid', async () => {
		mx10.data.removeLocomotive(3);

		const data = await firstValueFrom(mx10.data.onRemoveLocomotive);
		expect(data.nid).toBe(3);
		expect(data.state).toBeDefined();
	});

	it('0x12 - Image config test', async () => {
		const promise = firstValueFrom(mx10.data.onItemImageConfig).then((data) => {
			expect(data.itemNid()).toBe(3);
			expect(data.imageType()).toBe(ImageType.VEHICLE);
			expect(data.imageId()).toBe(6055);
		});

		mx10.data.itemImageConfig(3, ImageType.VEHICLE, 6055);

		return promise;
	});

	test.each<{icon: number; fx: number}>([
		{icon: 755, fx: 1},
		{icon: 756, fx: 1},
		{icon: 700, fx: 1},
	])('0x15 - Function image change test', async ({icon, fx}) => {
		const promise = firstValueFrom(mx10.data.onItemFxConfig).then((data) => {
			expect(data.nid).toBe(3);
			expect(data.function).toBe(fx);
			expect(data.item).toBe(FxConfigType.ICON);
			expect(data.data).toBe(icon);
		});

		mx10.data.itemFxConfig(3, fx, FxConfigType.ICON, icon);

		return promise;
	});

	test.each<{name: string}>([
		{name: '---'},
		{name: 'teßt Öf a näme'},
		{name: 'dodo1'},
	])('0x21 - Data name extended test', async ({name}) => {
		const msg = await mx10.data.setName(3, 0, name);
		expect(msg).toBeDefined();
		expect(msg?.itemNid()).toBe(3);
		expect(msg?.type()).toBe(NameType.VEHICLE);
		expect(msg?.name()).toBe(name);
	});
});

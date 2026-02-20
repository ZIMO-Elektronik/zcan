/* eslint-disable @typescript-eslint/no-unused-vars */

// 0x1A
import { Query } from '../docs_entrypoint';
import MX10 from '../MX10';
import {Subject} from 'rxjs';
import { MsgPortOpen } from './networkMsg';
import { MsgMode } from '../common/enums';

/**
 *
 * @category Groups
 */
export default class LanNetworkGroup
{
	public readonly onPortOpen = new Subject<MsgPortOpen>();

	private portOpenQ: Query<MsgPortOpen> | undefined = undefined;

	private mx10: MX10;


	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	// portOpen()
	// {
	// 	this.mx10.sendData(0x1a, 0x06, [
	// 		{value: 0xffffffff, length: 4},
	// 		{value: 0x5a417070, length: 4},
	// 		{value: 'ZIMO APP', length: 20},
	// 	], 0b01, this.mx10.myNID, true);
	// }

	async portOpen(clientName: string, clientId: number, comFlags = 0xffffffff): Promise<MsgPortOpen | undefined>
	{
		if(this.portOpenQ !== undefined && !await this.portOpenQ.lock()) {
			this.mx10.log.next("mx10.portOpen: failed to acquire lock");
			return undefined;
		}
		this.portOpenQ = new Query(MsgPortOpen.header(MsgMode.CMD, this.mx10.myNID), this.onPortOpen);
		this.portOpenQ.log = ((msg) => {
			this.mx10.log.next(msg);
		});
		this.portOpenQ.tx = ((header) => {
			const msg = new MsgPortOpen(header, clientId, comFlags, clientName);
			this.mx10.log.next('portOpen query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg, true);
		});
		this.portOpenQ.match = ((msg) => {
			this.mx10.log.next('portOpen query rx: ' + JSON.stringify(msg));
			return (msg.clientId() === clientId);
		});
		this.portOpenQ.subscribe(false);
		const rv = await this.portOpenQ.run();
		// if(rv) {
		// 	this.mx10.mx10NID = this.portOpenQ.header.nid || 0;
		// 	this.mx10.connected = true;
		// }
		this.mx10.log.next("mx10.portOpen.rv: " + JSON.stringify(rv));
		this.portOpenQ.unlock();
		this.portOpenQ = undefined;
		return rv;
	}

	// Responses
	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command) {
			case 0x06:
				this.mx10.log.next('parsePortOpen, nid = ' + nid + ', buf = ' + JSON.stringify(buffer))
				this.parsePortOpen(size, mode, nid, buffer);
				break;
			case 0x0e:
				this.parseUnknownCommand(size, mode, nid, buffer);
				break;
			default:
				// eslint-disable-next-line no-console
				console.warn('command not parsed: ' + command.toString());
		}
	}

	parsePortOpen(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onPortOpen.observed)
			return;
		const comFlags = buffer.readUint32LE(0);
		const clientId = buffer.readUint32LE(4);
		this.onPortOpen.next(new MsgPortOpen(MsgPortOpen.header(mode, nid), clientId, comFlags));
	}

	// 0x1A.0x0e
	parseUnknownCommand(size: number, mode: number, nid: number, buffer: Buffer)
	{
		// TODO implement once documented
		// console.debug('IMPLEMENT 0x1A.0x0e', size, mode, nid, buffer);
	}
}

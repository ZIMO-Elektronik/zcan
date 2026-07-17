// 0x0A
import {Subject} from 'rxjs';
import MX10 from '../MX10';
import {Buffer} from 'buffer';
import {PingResponseExtended} from '../common/models';
import { Query } from '../docs_entrypoint';
import { MsgPing, MsgPortClose } from './networkMsg';
import { MsgMode } from '../common/enums';

/**
 *
 * @category Groups
 */
export default class NetworkGroup
{
	public readonly onPing = new Subject<MsgPing>();
	public readonly onPortClose = new Subject<MsgPortClose>();

	private pingQ: Query<MsgPing> | undefined = undefined;
	private portCloseQ: Query<MsgPortClose> | undefined = undefined;

	private mx10: MX10;

	constructor(mx10: MX10)
	{
		this.mx10 = mx10;
	}

	// ping(mode = 0b10)
	// {
	// 	this.mx10.sendData(0x0a, 0x00, [{value: this.mx10.mx10NID, length: 2}], mode);
	// }

	async ping(nid = 0xc000)
	{
		if(this.pingQ !== undefined && !await Query.wait(() => !!this.pingQ)) {
			this.mx10.logInfo.next("mx10.ping: failed to acquire lock");
			return undefined;
		}
		this.pingQ = new Query(MsgPing.header(MsgMode.CMD, nid), this.onPing);
		this.pingQ.tx = ((header) => {
			const msg = new MsgPing(header, nid);
			// this.mx10.logInfo.next('ping query tx: ' + JSON.stringify(msg));
			this.mx10.sendMsg(msg, true);
		});
		this.pingQ.match = ((msg) => {
			// this.mx10.logInfo.next('ping query rx: ' + JSON.stringify(msg));
			if(nid & 0xff)
				return msg.header.nid === nid;
			return ((msg.header.nid||0) & 0xff00) === (nid & 0xff00);
		});
		this.pingQ.subscribe(false);
		const rv = await this.pingQ.run(100);
		// this.mx10.logInfo.next("mx10.ping.rv: " + JSON.stringify(rv));
		this.pingQ = undefined;
		return rv;
	}

	async portClose()
	{
		// if(this.portCloseQ !== undefined && !await Query.wait(() => !!this.portCloseQ)) {
		// 	this.mx10.logInfo.next("mx10.portClose: failed to acquire lock");
		// 	return undefined;
		// }
		// this.portCloseQ = new Query(MsgPortClose.header(MsgMode.CMD, this.mx10.mx10NID), this.onPortClose);
		// this.portCloseQ.tx = ((header) => {
		// 	const msg = new MsgPortClose(header, this.mx10.myNID);
		// 	this.mx10.logInfo.next('portClose query tx: ' + JSON.stringify(msg));
		// 	this.mx10.sendMsg(msg, true);
		// });
		// this.portCloseQ.match = ((msg) => {
		// 	this.mx10.logInfo.next('portClose query rx: ' + JSON.stringify(msg));
		// 	return true;
		// });
		// this.portCloseQ.subscribe(false);
		// const rv = await this.portCloseQ.run();
		// this.mx10.logInfo.next("mx10.portClose.rv: " + JSON.stringify(rv));
		// this.portCloseQ = undefined;
		// return rv;
		this.mx10.sendData(0x0a, 0x07, [{value: this.mx10.myNID, length: 2}], 0b01);
		this.mx10.mx10NID = 0;
	}

	parse(size: number, command: number, mode: number, nid: number, buffer: Buffer)
	{
		switch (command) {
			case 0x00:
				this.parsePing(size, mode, nid, buffer);
				break;
		}
	}

	// 0x0A.0x00
	parsePing(size: number, mode: number, nid: number, buffer: Buffer)
	{
		if(!this.onPing.observed)
			return;

		// this.mx10.logInfo.next('parsePing from 0x' + nid.toString(16) + ': ' + JSON.stringify(buffer));

		if(mode < MsgMode.EVT) {
			const nid = buffer.readUInt16LE(0);
			this.onPing.next(new MsgPing(MsgPing.header(mode, nid)));
		} else {
			const masterUid = buffer.readUInt32LE(0);
			const type = buffer.readUInt16LE(4);
			const session = buffer.readUInt16LE(6);
			this.onPing.next(new MsgPing(MsgPing.header(mode, nid), masterUid, type, session));
		}
	
		// if (size === 8) {
		// 	// TODO IMPLEMENT DETAIL READOUT

		// 	if (!this.mx10.mx10NID) {
		// 		this.mx10.mx10NID = nid;
		// 	}
		// 	this.mx10.connected = true;

		// 	// TODO reconnect when uuid has changed
		// 	// const uuid = buffer.readUInt32LE(0);

		// 	// this.mx10.reconnectLogic();

		// 	if (this.pingTimeout)
		// 		clearTimeout(this.pingTimeout);

		// 	this.pingTimeout = setTimeout(() => {
		// 		this.mx10.connected = false;
		// 		this.onPingResponse.next({
		// 			connected: this.mx10.connected,
		// 		});
		// 		this.mx10.logInfo.next('No ping for 2 seconds, disconnected');
		// 	}, 2000);
		// } else {
		// 	throw new Error(
		// 		'LENGTH ERROR: readCmdGrp_0x0A-0x0A, read length as: ' +
		// 			size.toString(),
		// 	);
		// }

		// this.onPingResponse.next({connected: this.mx10.connected});
	}
}

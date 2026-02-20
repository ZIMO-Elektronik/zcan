import {BindOptions, RemoteInfo, SocketOptions} from 'dgram';
import {Buffer} from 'buffer';
import {MsgMode} from './enums';
import {delay} from './utils';
import {Subject, Subscription} from 'rxjs';
import ExtendedASCII from './extendedAscii';

export type Header = {
	group: number,
	cmd: number,
	mode: MsgMode,
	nid: number,
}

export type ZcanData = {
	length: number;
	value: number | string;
};

export type ZcanDataArray = ZcanData[];

export class Message
{
	header: Header;
	data: ZcanDataArray;

	constructor(header: Header, data: ZcanDataArray = [])
	{
		this.header = header;
		this.data = data;
	}

	push(data: ZcanData): void
	{
		this.data.push(data);
	}

	rxDelay(millis: number) {/*implement in derived classes*/}

	udp(ownNid: number): Buffer
	{
		const size = 2 + this.data.reduce((sum, obj) => sum + obj.length, 0);
		const buffer = Buffer.alloc(size + 8);
		const cmd_md = (this.header.cmd << 2) | this.header.mode;

		buffer.writeUInt16LE(size, 0);
		buffer.writeUInt16LE(0, 2); // unused
		buffer.writeUInt8(this.header.group, 4);
		buffer.writeUInt8(cmd_md, 5);
		buffer.writeUInt16LE(ownNid, 6);
		buffer.writeUInt16LE(this.header.nid, 8);

		let offset = 10;

		this.data.forEach((element) => {
			if (typeof element.value === 'string') {
				ExtendedASCII.str2byte(element.value, buffer, offset, element.length);
				offset += element.length;
			} else switch (element.length) {
					case 1:
						buffer.writeUInt8(element.value, offset);
						offset += 1;
						break;
					case 2:
						buffer.writeUInt16LE(element.value, offset);
						offset += 2;
						break;
					case 4:
						buffer.writeUInt32LE(element.value, offset);
						offset += 4;
						break;
					default:
						// eslint-disable-next-line no-console
						console.warn(`ELEMENT LENGTH NOT DEFINED, ${element}`);
			}
		});
		return buffer;
	}
}

export class Query<T extends Message>
{
	header: Header;
	subject: Subject<T>;
	rx: Subscription | undefined = undefined;
	tx: (header: Header) => void = () => {};
	private result: T | undefined = undefined;
	match: (msg: T) => boolean = () => {return true};
	private mutex: boolean = false;
	log: (msg: string) => void = () => {};

	constructor(header: Header, subject: Subject<T> , match: (msg: T) => boolean = (() => {return true;}))
	{
		this.header = header;
		this.subject = subject;
		this.match = match;
	}

	async lock(millis: number = 500): Promise<boolean>
	{
		let centis = Math.abs(millis) / 10;
		while(this.mutex && centis)
		{
			await delay(10);
			if(!centis--)
				return false;
		}
		this.mutex = true;
		return true;
	}

	unlock()
	{
		this.mutex = false;
	}

	subscribe(matchNid: boolean = true)
	{
		this.rx = this.subject.subscribe((msg: T) =>
		{
			if(msg.header.mode < MsgMode.EVT)
				return;
			if(matchNid && msg.header.nid !== this.header.nid)
				return;
			//this.log('query.run.rx: ' + JSON.stringify(msg));
			if(!this.match(msg))
				return;
			this.result = msg;
			this.rx?.unsubscribe();
		});
	}

	async run(rxDelay: number = 5, retries: number = 5): Promise<T | undefined>
	{
		if(this.tx === undefined)
			return undefined;
		if(this.rx === undefined)
			this.subscribe();

		let tickFrom = 2 * Math.abs(retries);
		let tick = tickFrom;

		while(this.result === undefined)
		{
			if(tick % 2)
				await delay(rxDelay);
			else
				this.tx(this.header);

			if(!tick--) {
				this.log('query.run.failed :(');
				this.rx?.unsubscribe();
				return undefined;
			}
		}
		this.result.rxDelay(rxDelay * (tickFrom - tick));
		return this.result;
	}
}

export type NIDGenerator = () => Promise<number>;

export interface Socket {
	bind(port?: number, address?: string, callback?: () => void): this;
	bind(port?: number, callback?: () => void): this;
	bind(callback?: () => void): this;
	bind(options: BindOptions, callback?: () => void): this;

	on(
		event: 'message',
		listener: (msg: Buffer, rinfo: RemoteInfo) => void,
	): this;

	send(
		msg: string | Uint8Array,
		port?: number,
		address?: string,
		callback?: (error: Error | null, bytes: number) => void,
	): void;
	send(
		msg: string | Uint8Array,
		port?: number,
		callback?: (error: Error | null, bytes: number) => void,
	): void;
	send(
		msg: string | Uint8Array,
		callback?: (error: Error | null, bytes: number) => void,
	): void;
	send(
		msg: string | Uint8Array,
		offset: number,
		length: number,
		port?: number,
		address?: string,
		callback?: (error: Error | null, bytes: number) => void,
	): void;
	send(
		msg: string | Uint8Array,
		offset: number,
		length: number,
		port?: number,
		callback?: (error: Error | null, bytes: number) => void,
	): void;
	send(
		msg: string | Uint8Array,
		offset: number,
		length: number,
		callback?: (error: Error | null, bytes: number) => void,
	): void;

	close(callback?: () => void): this;
}

type createDgram = (
	options: SocketOptions,
	callback?: (msg: Buffer, rinfo: RemoteInfo) => void,
) => unknown;
type createNativeDgram = (
	options: {type: string; reusePort?: boolean; debug?: boolean},
	callback?: ((msg: Buffer) => void) | undefined,
) => unknown;

export type CreateSocketFunction = createDgram | createNativeDgram;

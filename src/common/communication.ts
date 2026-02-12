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
	value: number | string | ZcanData[];
};

export type ZcanDataArray = ZcanData[];

export type MessagePart = {index: number, offset: number, length: number, slice?: number};

export class Message
{
	header: Header;
	parts: MessagePart[];
	data: ZcanDataArray;

	public static log: (msg: string) => void = (msg) => {};

	constructor(header: Header, parts: MessagePart[] = [], data: ZcanDataArray = [])
	{
		this.header = header;
		this.parts = parts;
		this.data = data;
	}

	get(part: MessagePart, defaultValue: number | string | ZcanData[] | undefined = undefined):
		number | string | ZcanData[] | undefined
	{
		Message.log("get part " + JSON.stringify(part));
		if(part.index < 0)
			return this.header.nid;
		if(part.index >= this.data.length)
			return defaultValue;
		if(!part.slice) {
			const rv = this.data[part.index].value;
			Message.log("get rv " + rv.toString());
			return rv;
		}
		Message.log("get rv " + JSON.stringify(this.data[part.index].value));
		return this.data[part.index].value;
		// Message.log("we got slices?");
		// const rv: ZcanData[] = [];
		// for(let i=0; i<part.length/part.slice; i++) 
		// 	rv.push
		// 	rv.push({value: this.data[part.index].value as number >> (i*part.slice*8) & (i*part.slice*8-1),
		// 		length: part.slice});
		// Message.log("get rv " + JSON.stringify(rv));
		// return rv;
	}

	fill(buffer: Buffer, firstPart: number): void
	{
		if(!this.parts)
			return;
		this.parts.slice(firstPart).filter(part => part.index >= 0).forEach(part =>
		{
			// Message.log("msg.fill: " + JSON.stringify(part));
			if(part.slice)
			{
				// Message.log("msg.fill wif slices");
				const arr: ZcanData[] = [];
				for(let i=part.offset; i<part.offset+part.length; i+=part.slice) switch(part.slice)
				{
					case 1:
						arr.push({value: buffer.readUInt8(i), length: part.slice});
						break;
					case 2:
						arr.push({value: buffer.readUInt16LE(i), length: part.slice});
						break;
					case 4:
						arr.push({value: buffer.readUInt32LE(i), length: part.slice});
						break;
					default:
						arr.push({value: ExtendedASCII.byte2str(buffer.subarray(i, i+part.slice)), length: part.slice});
						break;
				}
				this.push({value: arr, length: part.length/part.slice});
			}
			else {
				// Message.log("msg.fill raww");
				switch(part.length)
			{
				case 1:
					this.push({value: buffer.readUInt8(part.offset), length: 1});
					break;
				case 2:
					// Message.log("msg.fill raw2: " + JSON.stringify(buffer));
					// Message.log("msg.fill raw2: " + buffer.readUInt16LE(part.offset));
					this.push({value: buffer.readUInt16LE(part.offset), length: 2});
					break;
				case 4:
					this.push({value: buffer.readUInt32LE(part.offset), length: 4});
					break;
				default:
					this.push({value: ExtendedASCII.byte2str(
						buffer.subarray(part.offset, part.offset+part.length)), length: part.length});
					break;
			}}
		});
		// Message.log("msg.full: " + JSON.stringify(this.data));
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

		this.data.forEach((element) =>
		{
			if (Array.isArray(element.value))
			{
				for(let sub of element.value as ZcanData[])
				{
					if (typeof sub.value === 'string') {
						ExtendedASCII.str2byte(sub.value, buffer, offset, sub.length);
						offset += sub.length;
					} else switch (sub.length) {
						case 1:
							buffer.writeUInt8(sub.value as number, offset);
							offset += 1;
							break;
						case 2:
							buffer.writeUInt16LE(sub.value as number, offset);
							offset += 2;
							break;
						case 4:
							buffer.writeUInt32LE(sub.value as number, offset);
							offset += 4;
							break;
						default:
							// eslint-disable-next-line no-console
							Message.log(`Message2Udp: ELEMENT LENGTH NOT DEFINED, ${element}`);
					}
				}
			} else if (typeof element.value === 'string') {
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
						if((element.length & 3) === 0) for(let i=0; i<element.length; i+=4) {
							buffer.writeUInt32LE(element.value, offset);
							offset += 4;
						} else if((element.length & 1) === 0) for(let i=0; i<element.length; i+=2) {
							buffer.writeUInt32LE(element.value, offset);
							offset += 2;
						} else for(let i=0; i<element.length; i++) {
							buffer.writeUInt8(element.value, offset);
							offset += 1;
						}
						// eslint-disable-next-line no-console
						Message.log(`Message2Udp: ELEMENT LENGTH NOT DEFINED, ${element}`);
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

	subscribe()
	{
		this.rx = this.subject.subscribe((msg: T) =>
		{
			if(msg.header.mode < MsgMode.EVT)
				return;
			if(msg.header.nid !== this.header.nid)
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

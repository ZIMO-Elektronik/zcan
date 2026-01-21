import {BindOptions, RemoteInfo, SocketOptions} from 'dgram';
import {Buffer} from 'buffer';
import {MsgMode} from 'src/util/enums';
import {delay, Subject, Subscription} from 'rxjs';

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

  constructor(header: Header, subject: Subject<T> , match: (msg: T) => boolean = (() => {return true;}))
  {
    this.header = header;
    this.subject = subject;
    this.match = match;
  }

  lock(millis: number = 500): boolean
  {
    let centis = Math.abs(millis) / 10;
    while(this.mutex)
    {
      delay(10);
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

  run(retries: number = 5): T | undefined
  {
    if(this.tx === undefined)
      return undefined;

    this.rx = this.subject.subscribe((msg: T) =>
    {
      if(!this.match(msg))
        return;
      if(msg.header.nid !== this.header.nid)
        return;
      this.result = (new Message(this.header, msg.data) as T);
      this.rx?.unsubscribe();
    });

    let tick = 2 * Math.abs(retries);

    while(this.result === undefined)
    {
      if(tick % 2 === 0)
        this.tx(this.header);
      if(!tick--) {
        this.rx?.unsubscribe();
        return undefined;
      }
      delay(5);
    }
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

import { BindOptions, RemoteInfo, SocketOptions } from 'dgram';
import { Buffer } from 'buffer';
import { MsgMode } from '../util/enums';
import { Subject, Subscription } from 'rxjs';
export type Header = {
    group: number;
    cmd: number;
    mode: MsgMode;
    nid: number;
};
export type ZcanData = {
    length: number;
    value: number | string;
};
export type ZcanDataArray = ZcanData[];
export declare class Message {
    header: Header;
    data: ZcanDataArray;
    constructor(header: Header, data?: ZcanDataArray);
    push(data: ZcanData): void;
    rxDelay(millis: number): void;
    udp(ownNid: number): Buffer;
}
export declare class Query<T extends Message> {
    header: Header;
    subject: Subject<T>;
    rx: Subscription | undefined;
    tx: (header: Header) => void;
    private result;
    match: (msg: T) => boolean;
    private mutex;
    log: (msg: string) => void;
    constructor(header: Header, subject: Subject<T>, match?: (msg: T) => boolean);
    lock(millis?: number): Promise<boolean>;
    unlock(): void;
    subscribe(): void;
    run(rxDelay?: number, retries?: number): Promise<T | undefined>;
}
export type NIDGenerator = () => Promise<number>;
export interface Socket {
    bind(port?: number, address?: string, callback?: () => void): this;
    bind(port?: number, callback?: () => void): this;
    bind(callback?: () => void): this;
    bind(options: BindOptions, callback?: () => void): this;
    on(event: 'message', listener: (msg: Buffer, rinfo: RemoteInfo) => void): this;
    send(msg: string | Uint8Array, port?: number, address?: string, callback?: (error: Error | null, bytes: number) => void): void;
    send(msg: string | Uint8Array, port?: number, callback?: (error: Error | null, bytes: number) => void): void;
    send(msg: string | Uint8Array, callback?: (error: Error | null, bytes: number) => void): void;
    send(msg: string | Uint8Array, offset: number, length: number, port?: number, address?: string, callback?: (error: Error | null, bytes: number) => void): void;
    send(msg: string | Uint8Array, offset: number, length: number, port?: number, callback?: (error: Error | null, bytes: number) => void): void;
    send(msg: string | Uint8Array, offset: number, length: number, callback?: (error: Error | null, bytes: number) => void): void;
    close(callback?: () => void): this;
}
type createDgram = (options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void) => unknown;
type createNativeDgram = (options: {
    type: string;
    reusePort?: boolean;
    debug?: boolean;
}, callback?: ((msg: Buffer) => void) | undefined) => unknown;
export type CreateSocketFunction = createDgram | createNativeDgram;
export {};

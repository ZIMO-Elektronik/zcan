import {BindOptions, RemoteInfo, SocketOptions, SocketType} from "dgram";
import {Buffer} from "buffer";

export type ZcanData = {
  length: number;
  value: number;
};

export type ZcanDataArray = ZcanData[];

export type NIDGenerator = () => Promise<number>;

export interface Socket {

  bind(port?: number, address?: string, callback?: () => void): this;
  bind(port?: number, callback?: () => void): this;
  bind(callback?: () => void): this;
  bind(options: BindOptions, callback?: () => void): this;

  on(event: 'message', listener: (msg: Buffer, rinfo: RemoteInfo) => void): this;

  send(msg: string | Uint8Array | ReadonlyArray<any>, port?: number, address?: string, callback?: (error: Error | null, bytes: number) => void): void;
  send(msg: string | Uint8Array | ReadonlyArray<any>, port?: number, callback?: (error: Error | null, bytes: number) => void): void;
  send(msg: string | Uint8Array | ReadonlyArray<any>, callback?: (error: Error | null, bytes: number) => void): void;
  send(msg: string | Uint8Array, offset: number, length: number, port?: number, address?: string, callback?: (error: Error | null, bytes: number) => void): void;
  send(msg: string | Uint8Array, offset: number, length: number, port?: number, callback?: (error: Error | null, bytes: number) => void): void;
  send(msg: string | Uint8Array, offset: number, length: number, callback?: (error: Error | null, bytes: number) => void): void;

  close(callback?: () => void): this;
}

type createDgram = (options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void) => unknown;
type createNativeDgram = (options: { type: string; reusePort?: boolean; debug?: boolean; }, callback?: ((msg: Buffer) => void) | undefined) => unknown;

export type CreateSocketFunction = createDgram | createNativeDgram;

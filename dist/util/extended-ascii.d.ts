import { Buffer } from 'buffer';
export default class ExtendedASCII {
    private static extendedChars;
    static str2byte(str: string, buf: Buffer, offset?: number, length?: number): number;
    static byte2str(buff: Buffer): string;
    static byteLength(str: string): number;
}

import { Buffer } from 'buffer';
import { MsgMode } from './enums';
import { delay } from './utils';
import ExtendedASCII from './extendedAscii';
export class Message {
    static log = () => { };
    header;
    data;
    constructor(header, data = []) {
        this.header = header;
        this.data = data;
    }
    push(...data) {
        this.data.push(...data);
    }
    rxDelay(millis) { }
    udp(ownNid) {
        let size = this.header.nid !== undefined && this.header.nid !== ownNid ? 2 : 0;
        size += this.data.reduce((sum, obj) => sum + obj.length, 0);
        const buffer = Buffer.alloc(size + 8);
        const cmd_md = (this.header.cmd << 2) | this.header.mode;
        buffer.writeUInt16LE(size, 0);
        buffer.writeUInt16LE(0, 2);
        buffer.writeUInt8(this.header.group, 4);
        buffer.writeUInt8(cmd_md, 5);
        buffer.writeUInt16LE(ownNid, 6);
        let offset = 8;
        if (this.header.nid !== undefined && this.header.nid !== ownNid) {
            buffer.writeUInt16LE(this.header.nid, offset);
            offset += 2;
        }
        this.data.forEach((element) => {
            if (typeof element.value === 'string') {
                ExtendedASCII.str2byte(element.value, buffer, offset, element.length);
                offset += element.length;
            }
            else
                switch (element.length) {
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
                        console.warn(`ELEMENT LENGTH NOT DEFINED, ${element}`);
                }
        });
        return buffer;
    }
}
export class Query {
    static log = () => { };
    header;
    subject;
    mute = false;
    abort = false;
    result = undefined;
    rx = undefined;
    tx = () => { };
    match = () => { return true; };
    log = Query.log;
    constructor(header, subject, match = (() => { return true; })) {
        this.header = header;
        this.subject = subject;
        this.match = match;
    }
    static async wait(mutexFun, millis = 500) {
        let centis = Math.abs(millis) / 10;
        let lock = mutexFun();
        while (lock) {
            if (lock && centis <= 0) {
                this.log('query gave up waiting after ' + millis + 'ms');
                return false;
            }
            await delay(10);
            centis--;
            lock = mutexFun();
        }
        this.log('query waited for ' + (millis - centis * 10) + 'ms');
        return true;
    }
    subscribe(matchNid = true) {
        this.rx = this.subject.subscribe((msg) => {
            if (msg.header.mode < MsgMode.EVT)
                return;
            if (matchNid && msg.header.nid !== this.header.nid)
                return;
            if (!this.match(msg))
                return;
            this.result = msg;
            this.rx?.unsubscribe();
        });
    }
    async run(rxDelay = 5, retries = 5) {
        if (this.tx === undefined)
            return undefined;
        if (this.rx === undefined)
            this.subscribe();
        let tickFrom = 2 * Math.abs(retries);
        let tick = tickFrom;
        while (this.result === undefined) {
            if (tick % 2)
                await delay(rxDelay);
            else if (!this.abort && !this.mute)
                this.tx(this.header);
            if (!tick-- || this.abort) {
                this.log('query.run.failed: ' + JSON.stringify(this.header));
                this.rx?.unsubscribe();
                return undefined;
            }
        }
        this.result.rxDelay(rxDelay * (tickFrom - tick));
        return this.result;
    }
}
//# sourceMappingURL=communication.js.map
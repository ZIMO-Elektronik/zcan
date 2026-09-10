import { Buffer } from 'buffer';
import { MsgMode } from '../util/enums';
import { delay } from '../internal/utils';
import ExtendedASCII from '../util/extended-ascii';
export class Message {
    header;
    data;
    constructor(header, data = []) {
        this.header = header;
        this.data = data;
    }
    push(data) {
        this.data.push(data);
    }
    rxDelay(millis) { }
    udp(ownNid) {
        const size = 2 + this.data.reduce((sum, obj) => sum + obj.length, 0);
        const buffer = Buffer.alloc(size + 8);
        const cmd_md = (this.header.cmd << 2) | this.header.mode;
        buffer.writeUInt16LE(size, 0);
        buffer.writeUInt16LE(0, 2);
        buffer.writeUInt8(this.header.group, 4);
        buffer.writeUInt8(cmd_md, 5);
        buffer.writeUInt16LE(ownNid, 6);
        buffer.writeUInt16LE(this.header.nid, 8);
        let offset = 10;
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
    header;
    subject;
    rx = undefined;
    tx = () => { };
    result = undefined;
    match = () => { return true; };
    mutex = false;
    log = () => { };
    constructor(header, subject, match = (() => { return true; })) {
        this.header = header;
        this.subject = subject;
        this.match = match;
    }
    async lock(millis = 500) {
        let centis = Math.abs(millis) / 10;
        while (this.mutex && centis) {
            await delay(10);
            if (!centis--)
                return false;
        }
        this.mutex = true;
        return true;
    }
    unlock() {
        this.mutex = false;
    }
    subscribe() {
        this.rx = this.subject.subscribe((msg) => {
            if (msg.header.mode < MsgMode.EVT)
                return;
            if (msg.header.nid !== this.header.nid)
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
            else
                this.tx(this.header);
            if (!tick--) {
                this.log('query.run.failed :(');
                this.rx?.unsubscribe();
                return undefined;
            }
        }
        this.result.rxDelay(rxDelay * (tickFrom - tick));
        return this.result;
    }
}
//# sourceMappingURL=communication.js.map
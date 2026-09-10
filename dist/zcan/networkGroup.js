import { Subject } from 'rxjs';
export default class NetworkGroup {
    onPingResponse = new Subject();
    mx10;
    pingTimeout = null;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    ping(mode = 0b10) {
        this.mx10.sendData(0x0a, 0x00, [
            {
                value: this.mx10.mx10NID,
                length: 2,
            },
        ], mode);
    }
    portClose() {
        this.mx10.sendData(0x0a, 0x07, [{ value: this.mx10.myNID, length: 2 }], 0b01);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x00:
                this.pingResponse(size, mode, nid, buffer);
                break;
        }
    }
    pingResponse(size, mode, nid, _buffer) {
        if (this.onPingResponse.observed) {
            if (size === 8) {
                if (!this.mx10.mx10NID) {
                    this.mx10.mx10NID = nid;
                }
                this.mx10.connected = true;
                this.mx10.reconnectLogic();
                if (this.pingTimeout) {
                    clearTimeout(this.pingTimeout);
                }
                this.pingTimeout = setTimeout(() => {
                    this.mx10.connected = false;
                    this.onPingResponse.next({
                        connected: this.mx10.connected,
                    });
                    console.log('No ping for 2 seconds, disconnected');
                }, 2000);
            }
            else {
                throw new Error('LENGTH ERROR: readCmdGrp_0x0A-0x0A, read length as: ' +
                    size.toString());
            }
            this.onPingResponse.next({
                connected: this.mx10.connected,
            });
        }
    }
}
//# sourceMappingURL=networkGroup.js.map
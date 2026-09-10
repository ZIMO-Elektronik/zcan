export default class TrainControlGroup {
    mx10;
    constructor(mx10) {
        this.mx10 = mx10;
    }
    trainPartFind(NID) {
        this.mx10.sendData(0x05, 0x02, [{ value: NID, length: 2 }], 0b00);
    }
    parse(size, command, mode, nid, buffer) {
        switch (command) {
            case 0x02:
                this.parseTrainPartFind(size, mode, nid, buffer);
                break;
        }
    }
    parseTrainPartFind(size, mode, nid, buffer) {
    }
}
//# sourceMappingURL=trainControlGroup.js.map
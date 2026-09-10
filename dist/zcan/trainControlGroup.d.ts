import MX10 from '../MX10';
export default class TrainControlGroup {
    private mx10;
    constructor(mx10: MX10);
    trainPartFind(NID: number): void;
    parse(size: number, command: number, mode: number, nid: number, buffer: Buffer): void;
    parseTrainPartFind(size: number, mode: number, nid: number, buffer: Buffer): void;
}

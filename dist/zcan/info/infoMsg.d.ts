import { Header, Message, ZcanDataArray } from "../../@types/communication";
import { ModInfoType, MsgMode } from "../../util/enums";
export declare class MsgModInfo extends Message {
    static header(mode: MsgMode, nid: number): Header;
    constructor(header: Header, type: ModInfoType, data?: ZcanDataArray);
    type(): ModInfoType | undefined;
    info(): number | undefined;
}


import { Header, Message } from "../common/communication";
import { MsgMode } from "../common/enums";


export class MsgGroupCount extends Message
{
    public static header(mode: MsgMode, nid: number): Header
    {return {group: 0x7, cmd: 0x0, mode: mode, nid: nid}}

    constructor(header: Header, group?: number, count?: number)
    {
        super(header);
        if(group !== undefined)
            super.push({value: group, length: 2});
        // super.push({value: groupNid, length: 2});
        if(count !== undefined)
            super.push({value: count, length: 2});
    }

    group() {return this.data.length ? this.data[0].value as number : this.header.nid;}
    count() {return this.data.length > 1 ? this.data[1].value as number : 0;}
}


export class MsgItemsByIndexReq extends Message
{
    public static header(mode: MsgMode, nid: number): Header
    {return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

    constructor(header: Header, mx10Nid: number, groupNid: number, index: number)
    {
        super(header);
        super.push({value: mx10Nid, length: 2});
        super.push({value: groupNid, length: 2});
        super.push({value: index, length: 2});
    }
}

export class MsgItemsByIndexRsp extends Message
{
    public static header(mode: MsgMode, nid: number): Header
    {return {group: 0x7, cmd: 0x1, mode: mode, nid: nid}}

    constructor(header: Header, index: number, itemNid: number, itemState: number, lastTick: number | undefined)
    {
        super(header);
        super.push({value: index, length: 2});
        super.push({value: itemNid, length: 2});
        super.push({value: itemState, length: 2});
        if(lastTick !== undefined)
            super.push({value: lastTick, length: 2});
    }
    index(): number {return (this.data[1].value as number)}
    itemNid(): number {return (this.data[2].value as number)}
    itemState(): number {return (this.data[3].value as number)}
    lastTick(): number {return (this.data[4].value as number)}
}

export class MsgItemsByNidReq extends Message
{
    public static header(mode: MsgMode, nid: number): Header
    {return {group: 0x7, cmd: 0x2, mode: mode, nid: nid}}

    constructor(header: Header, mx10Nid: number, precedingNid: number)
    {
        super(header);
        super.push({value: mx10Nid, length: 2});
        super.push({value: precedingNid, length: 2});
    }
}

export class MsgItemsByNidRsp extends Message
{
    public static header(mode: MsgMode, nid: number): Header
    {return {group: 0x7, cmd: 0x2, mode: mode, nid: nid}}

    constructor(header: Header, itemNid: number, index: number, itemState: number, lastTick: number | undefined)
    {
        super(header);
        super.push({value: itemNid, length: 2});
        super.push({value: index, length: 2});
        super.push({value: itemState, length: 2});
        if(lastTick !== undefined)
            super.push({value: lastTick, length: 2});
    }
    itemNid(): number {return (this.data[1].value as number)}
    index(): number {return (this.data[2].value as number)}
    itemState(): number {return (this.data[3].value as number)}
    lastTick(): number {return (this.data[4].value as number)}
}
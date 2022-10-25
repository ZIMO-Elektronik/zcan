---
id: bidi-info
title: BiDi Info
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="08" command="05"/>

## Receiving

When receiving command _0x05_ the 'Data' section will look like this:

| NID    | Type   | Data   |
|--------|--------|--------|
| 16 Bit | 16 Bit | 32 Bit |


With this data-gram the MX10 BiDi reports information The 'NID' indicates which device should answer the question. Typically this is the NID of the the PC is connected to. However, especially in a network, it can also be another device (e.g.: Tab, another PC).

### Type table

| Type   | Description        |
|--------|--------------------|
| 0x0100 | BiDi Speed         |
| 0x0101 | Tilt/Curve         |
| 0x0200 | BiDi CV            |
| 0x0300 | BiDi QoS           |
| 0x0400 | BiDi Fill level    |
| 0x0800 | BiDi Direction     |
| 0x1000 | BiDi Track Voltage |
| 0x1100 | BiDi Alarms        |


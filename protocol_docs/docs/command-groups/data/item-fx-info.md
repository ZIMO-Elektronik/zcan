---
id: item-fx-info
title: Item Fx Info
sidebar_position: 6
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="15"/>

## Receiving

When receiving command _0x15_ the 'Data' section will look like this:

| NID    | Fx     | Unused | Type  | Data   |
|--------|--------|--------|-------|--------|
| 16 Bit | 16 Bit | 8 Bit  | 8 Bit | 16 Bit |


## Sending

When sending command _0x15_ the 'Data' section will look like this:

| NID    | Fx     | 0     | Type  | Data   |
|--------|--------|-------|-------|--------|
| 16 Bit | 16 Bit | 8 Bit | 8 Bit | 16 Bit |


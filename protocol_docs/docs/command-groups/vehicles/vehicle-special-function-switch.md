---
id: vehicle-special-function-switch
title: Vehicle Special Function Switch
sidebar_position: 3
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="05"/>

## Receiving

When receiving command _0x05_ the 'Data' section will look like this:

| NID    | Special function mode | Special function value |
|--------|-----------------------|------------------------|
| 16 Bit | 16 Bit                | 16 Bit                 |


### Special function mode and values

| Special function mode | Description       | Special function value                                        |
|-----------------------|-------------------|---------------------------------------------------------------|
| 1                     | Manual            | OFF = 0<br/> ON = 1                                           |
| 2                     | Shunting function | OFF = 0<br/> AZBZ = 1<br/> Half = 2                           |
| 3                     | DirectionDefault  | No change = 0<br/> Direction East = 1<br/> Direction West = 2 |

## Sending

When sending command _0x05_ the 'Data' section will look like this:

| NID    | Special function mode | Special function value |
|--------|-----------------------|------------------------|
| 16 Bit | 16 Bit                | 16 Bit                 |


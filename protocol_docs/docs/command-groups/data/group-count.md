---
id: group-count
title: Group Count
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="00"/>

## Receiving

When receiving command _0x00_ the 'Data' section will look like this:

| Object type | Number |
|-------------|--------|
| 16 Bit      | 16 Bit |


By Mode = 0b00 a device can query if the MX10 knows a certain device group (Object type). The MX10 responds (Mode = 0b11) with group and the known number of devices in the respective group.

:::note

Group Count for MX8, MX9 modules returns with unknown count (e.g. because request too early, auto-scan off, feedback error is present,...) the result is 0xFFFF.

:::

### Object type codes

| Object type | Description                      |
|-------------|----------------------------------|
| 0x0000      | Vehicles                         |
| 0x2F00      | Trains                           |
| 0x3000      | Accessories, DCC 'simple'        |
| 0x3200      | DCC 'eXtended' accessory decoder |
| 0x5040      | MX8 Module                       |
| 0x5080      | MX9 Module                       |


## Sending

When sending command _0x00_ the 'Data' section will look like this:

| NID    | Object type |
|--------|-------------|
| 16 Bit | 16 Bit      |

:::note

Mode should be set to 0b00.

:::

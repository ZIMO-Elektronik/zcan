---
id: vehicle-speed
title: Vehicle Speed
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="02"/>

:::info

East/West direction can't be changed with this command.
It can be changed with [Vehicle special function switch](./vehicle-special-function-switch.md)

:::

## Receiving

When receiving command _0x02_ the 'Data' section will look like this:

| NID    | Speed and direction | Divisor |
|--------|---------------------|---------|
| 16 Bit | 16 Bit              | 8 Bit   |


If Mode = 0b00, then the speed of the locomotive is requested with 'NID'. <br/> If M = 0b01, then the speed of the
locomotive is set to the transferred value with 'NID'. <br/> If M = 0b11, then the locomotive responds with 'NID' to the
request for its speed. <br/> Speeds are always sent with 10 Bit, in the upper 6 Bit additional Flags are sent. The
respective conversion into rail format is done in the TSE. The 'Divisor' value indicates a shunting divisor (e.g.: /2 or
/4) for a finer shunting resolution.

### Speed and direction flags

| Bit       | Description                                      | Value description                                |
|-----------|--------------------------------------------------|--------------------------------------------------|
| 0 ... 9   | Vehicle speed                                    |
| 10        | Direction instruction (client to MX10)           | '0' ➔ Forward <br/> '1' ➔ Backward               |
| 11        | Current track direction (MX10 to client)         | '0' ➔ Forward <br/> '1' ➔ Backward               |
| 12 ... 13 | Sideways direction (Last direction from RailCom) | '0' ➔ Undefined <br/> '1' ➔ East<br/> '2' ➔ West |
| 14        | Unused 🚧                                        |                                                  |
| 15        | Vehicle Emergency Stop                           |                                                  |

:::note
For all track formats, the maximum ZIMO speed is 1008.  Values > 1008 are automatically set to 1008.
:::

## Sending

When sending command _0x02_ the 'Data' section will look like this:

| Vehicle address | Speed + direction | Value           |
|-----------------|-------------------|-----------------|
| 16 Bit          | 16 Bit            | 0x0000 - 16 Bit |


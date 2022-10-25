---
id: data-value-extended
title: Data Value Extended
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="17" command="08"/>

## Receiving

When receiving command _0x08_ the 'Data' section will look like this:

| NID    | Unused 🚧 | Flag bytes | Unused 🚧 | Track mode | Function count | Unused 🚧 | Speed and direction | Functions | Special functions |
|--------|-----------|------------|-----------|------------|----------------|-----------|---------------------|-----------|-------------------|
| 16 Bit | 16 Bit    | 32 Bit     | 128 Bit   | 8 Bit      | 8 Bit          | 144 Bit   | 16 Bit              | 32 Bit    | 32 Bit            |

### Speed and direction flags

| Bit       | Meaning                                                                                                                          |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| 0 ... 9   | Vehicle speed.     Note: For all track formats, the maximum ZIMO speed is 1008.  Values > 1008 are automatically scaled to 1008. |
| 10        | Direction instruction (client to MX10)<br/> '0' ➔ Forward<br/> '1' ➔ Backward                                                    |
| 11        | Current track direction (MX10 to client)<br/> '0' ➔ Forward<br/> '1' ➔ Backward                                                  |
| 12 ... 13 | Sideways <br/>'0' ➔ Undefined<br/> '1' ➔ East<br/> '2' ➔ West                                                                    |
| 14        | Unused 🚧                                                                                                                        |
| 15        | Vehicle Emergency Stop                                                                                                           |


### Track mode flags

| Bit     | Meaning                                                                                    |
|---------|--------------------------------------------------------------------------------------------|
| 4 ... 7 | 0: unknown<br/> 1: DCC<br/> 2: MM2<br/> 3: not defined<br/> 4: mfx<br/> 7: System Use<br/> |

### Flag bytes 🚧

:::caution Under construction🚧

Description of flags is needed

:::

### Special functions

| Bit     | Meaning                 |
|---------|-------------------------|
| 0 ... 3 | Shunting function state |
| 4 ... 5 | Manual mode state       |

## Sending

When sending command _0x08_ the 'Data' section will look like this:

| Mx10 NID | NID    | 0      |
|----------|--------|--------|
| 16 Bit   | 16 Bit | 16 Bit |


:::note

Mode should be set to 0b00.

:::

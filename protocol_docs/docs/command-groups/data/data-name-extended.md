---
id: data-name-extended
title: Data Name Extended
sidebar_position: 7
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="21"/>

## Receiving

This command is only available on the PC interface (USB/LAN). This allows an app to transfer texts with up to 192 characters in one command. However, some entries are limited to 32 characters, or there are limitations in the GUI display.

:::warning

Names and other strings needs to be sent terminated with 0x00

:::

When receiving command _0x21_ the 'Data' section will look like this:

| NID    | Sub ID | Value1 | Value2 | Name      |
|--------|--------|--------|--------|-----------|
| 16 Bit | 16 Bit | 32 Bit | 32 Bit | 191 Bytes |


The 'NID' indicates for which device the text is valid. If 'NID' is e.g.: the NID of a vehicle, the texts are linked to this vehicle. All other texts can also be transmitted with this command.

### Description table for value 1 / 2

| NID         | Sub ID       | Value1                          | Value2 | Usage                      | Max length    |
|-------------|--------------|---------------------------------|--------|----------------------------|---------------|
| Vehicle     | 0            | 0                               | 0      | Vehicle name               | 32 characters |
|             | 1            | 0                               | 0      | Railroad company           | 32 characters |
| Accessories | Port         | 0                               | 0      | Designation for connection |               |
| 0x7F00      | Vendor       | 0                               | 0      | Manufacturer names         | 32 characters |
| 0x7F02      | Decoder      | 0                               | 0      | Decoder name/types         | 32 characters |
| 0x7F04      | CfgName      | Type (8Bit)<br/> CgfNum (24Bit) | 0      | CV Designation             | 32 characters |
| 0x7F06      | Cfg Db       |                                 |        | Cfg Db                     | 32 characters |
| 0x7F10      | Icon         |                                 |        | Icon                       | 32 characters |
| 0x7F11      | Icon         |                                 |        | Icon                       | 32 characters |
| 0x7F18      | ZIMO Partner |                                 |        | ZIMO Partner               | 32 characters |
| 0x7F20      | Land         |                                 |        | Land                       | 32 characters |


:::info

Value2 is intended for groups.

:::

## Sending

When sending command _0x21_ the 'Data' section will look like this:

| NID    | Sub ID | 0      | 0      | Name                | 0     |
|--------|--------|--------|--------|---------------------|-------|
| 16 Bit | 16 Bit | 32 Bit | 32 Bit | Name length * 8 Bit | 8 Bit |


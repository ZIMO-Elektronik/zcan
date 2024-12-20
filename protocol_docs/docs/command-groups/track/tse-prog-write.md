---
id: tse-prog-write
title: TSE Prog Write
sidebar_position: 2
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="16" command="09"/>

## Receiving

When receiving command _0x09_ the 'Data' section will look like this:

| System NID | Vehicle NID | Config number | Value |
|------------|-------------|---------------|-------|
| 16 Bit     | 16 Bit      | 32 Bit        | 8 Bit |


The command (0b01) causes the command station (NID) to send a 'Config Write' command to the rail decoder (vehicle NID). As long as the write command is 'active', the progress will be reported by TSE Info's. As soon as the command station writes the desired Config value, this is reported by a 'TSE Write ACK' telegram.

:::danger

After Read/Write commands the respective control unit (MX32, PC, ...) should keep a pause of approx. 200mS. This serves that other rail commands can be processed.

:::

## Sending

When sending command _0x09_ the 'Data' section will look like this:

| Train address | CV     | Value |
|---------------|--------|-------|
| 16 Bit        | 32 Bit | 8 Bit |


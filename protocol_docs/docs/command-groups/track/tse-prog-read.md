---
id: tse-prog-read
title: TSE Prog Read
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="16" command="08"/>

## Receiving

When receiving command _0x08_ the 'Data' section will look like this:

With the TSE Read commands CV's can be read from a decoder. The selected TSE mode (Cmd=0x00) decides whether this should be done by POM (default) or Service Mode commands.

| System NID | Vehicle NID | Config number | Value |
|------------|-------------|---------------|-------|
| 16 Bit     | 16 Bit      | 32 Bit        | 8 Bit |


The command (0b01) causes the command station (NID) to send a 'Config Read' command to the rail decoder (vehicle NID). As long as the read command is 'active', the progress will be reported by TSE Info's. AAs soon as the control panel has the desired config value, this is signaled by a 'TSE Read ACK' telegram.

:::danger

After Read/Write commands the respective control unit (MX32, PC, ...) should keep a pause of approx. 200mS. This serves that other rail commands can be processed.

:::

## Sending

When sending command _0x08_ the 'Data' section will look like this:

| Train address | CV     |
|---------------|--------|
| 16 Bit        | 32 Bit |


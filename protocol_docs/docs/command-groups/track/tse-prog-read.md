---
id: tse-prog-read
title: TSE Prog Read
sidebar_position: 1
---

## Receiving [0x16, 0x08]

When receiving command _0x08_ the 'Data' section will look like this:

With the TSE Read commands CV's can be read from a decoder. The selected TSE mode (Cmd=0x00) decides whether this should be done by POM (default) or Service Mode commands.

<table>
  <tr>
    <th>System NID</th>
    <th>Vehicle NID</th>
    <th>Config number</th>
    <th>Value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

The command (0b01) causes the command station (NID) to send a 'Config Read' command to the rail decoder (vehicle NID). As long as the read command is 'active', the progress will be reported by TSE Info's. AAs soon as the control panel has the desired config value, this is signaled by a 'TSE Read ACK' telegram.

:::danger

After Read/Write commands the respective control unit (MX32, PC, ...) should keep a pause of approx. 200mS. This serves that other rail commands can be processed.

:::

## Sending [0x16, 0x08]

When sending command _0x08_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Train address</th>
    <th>CV</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>32 Bit</th>
  </tr>
</table>

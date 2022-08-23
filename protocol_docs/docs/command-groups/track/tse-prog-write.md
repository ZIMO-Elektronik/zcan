---
id: tse-prog-write
title: TSE Prog Write
sidebar_position: 2
---

## Receiving [0x16, 0x09]

When receiving command _0x09_ the 'Data' section will look like this:

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

The command (0b01) causes the command station (NID) to send a 'Config Write' command to the rail decoder (vehicle NID). As long as the write command is 'active', the progress will be reported by TSE Info's. As soon as the command station writes the desired Config value, this is reported by a 'TSE Write ACK' telegram.

:::danger

After Read/Write commands the respective control unit (MX32, PC, ...) should keep a pause of approx. 200mS. This serves that other rail commands can be processed.

:::

## Sending [0x16, 0x09]

When sending command _0x09_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Train address</th>
    <th>CV</th>
    <th>Value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

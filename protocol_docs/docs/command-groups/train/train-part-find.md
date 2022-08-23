---
id: train-part-find
title: Train Part Find
sidebar_position: 1
---

## Receiving [0x05, 0x02]

When receiving command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Train NID</th>
    <th>Owner NID</th>
    <th>State</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

## Sending [0x05, 0x02]

When sending command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
  </tr>
  <tr>
    <th>16 Bit</th>
  </tr>
</table>

:::note

Mode should be set to 0b00.

:::

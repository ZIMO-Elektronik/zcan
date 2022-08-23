---
id: remove-train
title: Remove Train
sidebar_position: 4
---

## Receiving [0x07, 0x04]

When receiving command _0x04_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>State</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

## Sending [0x07, 0x04]

When sending command _0x04_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Remove from NID</th>
    <th>NID to remove</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::note

'Remove from NID' specifies which device should remove the train.

:::

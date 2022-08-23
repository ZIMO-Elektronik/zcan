---
id: item-fx-info
title: Item Fx Info
sidebar_position: 6
---

## Receiving [0x07, 0x15]

When receiving command _0x15_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Fx</th>
    <th>Unused</th>
    <th>Type</th>
    <th>Data</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

## Sending [0x07, 0x15]

When sending command _0x15_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Fx</th>
    <th>0</th>
    <th>Type</th>
    <th>Data</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

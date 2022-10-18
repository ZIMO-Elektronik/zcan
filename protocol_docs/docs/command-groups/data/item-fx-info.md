---
id: item-fx-info
title: Item Fx Info
sidebar_position: 6
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="15"/>

## Receiving

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

## Sending

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

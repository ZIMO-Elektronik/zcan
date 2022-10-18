---
id: train-part-find
title: Train Part Find
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="05" command="02"/>

## Receiving

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

## Sending

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

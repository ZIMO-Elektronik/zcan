---
id: remove-train
title: Remove Train
description: 0x07.0x1f
sidebar_position: 4
---
import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="1f"/>

## Receiving 

When receiving command the 'Data' section will look like this:

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

## Sending

When sending command the 'Data' section will look like this:

<table>
  <tr>
    <th>Remove from device with NID</th>
    <th>NID of locomotive (or other device) to remove</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::note

'Remove from NID' specifies which device should remove the train.

:::

---
id: group-count
title: Group Count
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="00"/>

## Receiving

When receiving command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Object type</th>
    <th>Number</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

By Mode = 0b00 a device can query if the MX10 knows a certain device group (Object type). The MX10 responds (Mode = 0b11) with group and the known number of devices in the respective group.

:::note

Group Count for MX8, MX9 modules returns with unknown count (e.g. because request too early, auto-scan off, feedback error is present,...) the result is 0xFFFF.

:::

### Object type codes

<table>
  <tr>
    <th>Object type</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th class='left_align'>Vehicles</th>
  </tr>
  <tr>
    <th>0x2F00</th>
    <th class='left_align'>Trains</th>
  </tr>
  <tr>
    <th>0x3000</th>
    <th class='left_align'>Accessories, DCC 'simple'</th>
  </tr>
  <tr>
    <th>0x3200</th>
    <th class='left_align'>DCC 'eXtended' accessory decoder</th>
  </tr>
  <tr>
    <th>0x5040</th>
    <th class='left_align'>MX8 Module</th>
  </tr>
  <tr>
    <th>0x5080</th>
    <th class='left_align'>MX9 Module</th>
  </tr>
</table>

## Sending

When sending command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Object type</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::note

Mode should be set to 0b00.

:::

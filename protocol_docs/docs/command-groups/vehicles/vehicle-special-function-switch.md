---
id: vehicle-special-function-switch
title: Vehicle Special Function Switch
sidebar_position: 3
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="05"/>

## Receiving

When receiving command _0x05_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Special function mode</th>
    <th>Special function value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

### Special function mode and values

<table>
  <tr>
    <th>Special function mode</th>
    <th>Description</th>
    <th>Special function value</th>
  </tr>
  <tr>
    <th>1</th>
    <th>Manual</th>
    <th class='left_align'>OFF = 0<br/>
        ON = 1<br/></th>
  </tr>
  <tr>
    <th>2</th>
    <th>Shunting function</th>
    <th class='left_align'>OFF = 0<br/>
        AZBZ = 1<br/>
        Half = 2</th>
  </tr>
  <tr>
    <th>3</th>
    <th>DirectionDefault</th>
    <th class='left_align'>No change = 0<br/>
        Direction East = 1<br/>
        Direction West = 2</th>
  </tr>
</table>

## Sending

When sending command _0x05_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Special function mode</th>
    <th>Special function value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

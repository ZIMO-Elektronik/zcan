---
id: data-value-extended
title: Data Value Extended
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="17" command="08"/>

## Receiving

When receiving command _0x08_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Unused 🚧</th>
    <th>Flag bytes</th>
    <th>Unused 🚧</th>
    <th>Track mode</th>
    <th>Function count</th>
    <th>Unused 🚧</th>
    <th>Speed and direction</th>
    <th>Functions</th>
    <th>Special functions</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>128 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>144 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>32 Bit</th>
  </tr>
</table>

### Speed and direction flags

<table >
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
<tbody class='left_align'>
  <tr>
    <th>0 ... 9</th>
    <th>Vehicle speed. <br/>
    <i>Note: For all track formats, the maximum ZIMO speed is 1008. <br/> Values > 1008 are automatically scaled to 1008.</i></th>
  </tr>
  <tr>
    <th>10</th>
    <th>Direction instruction (client to MX10) <br/>
      '0' ➔ Forward <br/>
      '1' ➔ Backward</th>
  </tr>
  <tr>
    <th>11</th>
    <th>Current track direction (MX10 to client) <br/>
        '0' ➔ Forward <br/>
        '1' ➔ Backward</th>
  </tr>
  <tr>
    <th>12 ... 13</th>
    <th>Side way <br/>
        '0' ➔ Undefined <br/>
        '1' ➔ East<br/>
        '2' ➔ West</th>
  </tr>
  <tr>
    <th>14</th>
    <th>Unused 🚧</th>
  </tr>
  <tr>
    <th>15</th>
    <th>Vehicle Emergency Stop</th>
  </tr>
  </tbody>
</table>

### Track mode flags

<table>
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <th>4 ... 7</th>
    <th class='left_align'>
        0: unknown<br/>
        1: DCC<br/>
        2: MM2<br/>
        3: not defined<br/>
        4: mfx<br/>
        7: System Use</th>
  </tr>
</table>

### Flag bytes 🚧

:::caution Under construction🚧

Description of flags is needed

:::

### Special functions

<table>
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <th>0 ... 3</th>
    <th class='left_align'>
        Shunting function state</th>
  </tr>
  <tr>
    <th>4 ... 5</th>
    <th class='left_align'>
        Manual mode state</th>
  </tr>
</table>
## Sending

When sending command _0x08_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Mx10 NID</th>
    <th>NID</th>
    <th>0</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::note

Mode should be set to 0b00.

:::

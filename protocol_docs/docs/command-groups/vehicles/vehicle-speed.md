---
id: vehicle-speed
title: Vehicle Speed
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="02"/>

## Receiving

When receiving command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Speed and direction</th>
    <th>Divisor</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

If Mode = 0b00, then the speed of the locomotive is requested with 'NID'. <br/> If M = 0b01, then the speed of the locomotive is set to the transferred value with 'NID'. <br/> If M = 0b11, then the locomotive responds with 'NID' to the request for its speed. <br/> Speeds are always sent with 10 Bit, in the upper 6 Bit additional Flags are sent. The respective conversion into rail format is done in the TSE. The 'Divisor' value indicates a shunting divisor (e.g.: /2 or /4) for a finer shunting resolution.

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

## Sending

When sending command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Vehicle address</th>
    <th>Speed + direction</th>
    <th>Value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>0x0000 - 16 Bit</th>
  </tr>
</table>

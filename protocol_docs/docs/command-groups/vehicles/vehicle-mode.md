---
id: vehicle-mode
title: Vehicle Mode
sidebar_position: 0
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="01"/>

These data-grams are used to query or set the vehicle's operating mode. In order for the MX10 to control the vehicle, the operating parameters must be known. The operating parameters of the vehicle can/must be determined by the PC software! To do this, it can query them first and add only the "unknown" parameters, or simply send "your" parameters as a command. In any case, the MX10 works with the last defined (received) vehicle parameters and stores them on the end of operation.

## Receiving

When receiving command _0x01_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Mode1</th>
    <th>Mode2</th>
    <th>Mode3</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

Mode=0b00 allows the control unit to query the current operating parameters for a vehicle. With a response with M1=0x00 and M2=0x00 the respective vehicle is unknown to the MX10.

### Mode 1 flags

<table>
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <th>0 ... 3</th>
    <th class="left_align">
      Speed Steps:<br />
      0: 'unknown<br />
      1: 14FS<br />
      2: 27FS<br />
      3: 28FS<br />
      4: 128FS<br />
      5: 1024FS<br />
      6 - 7: not defined<br />
    </th>
  </tr>
  <tr>
    <th>4 ... 7</th>
    <th class='left_align'>Operating mode:<br/>
        0: unknown<br/>
        1: DCC<br/>
        2: MM2<br/>
        3: not defined<br/>
        4: mfx<br/>
        7: System Use</th>
  </tr>
</table>

### Mode 2 flags

<table>
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <th>0 ... 7</th>
    <th>Max. Number of functions: None (0) to currently max. 32</th>
  </tr>
</table>

### Mode 3 flags

<table>
  <tr>
    <th>Bit</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <th>0</th>
    <th class='left_align'>Pulse Fx (functions are thus sent pulse chain, LGB)</th>
  </tr>
  <tr>
    <th>1</th>
    <th class='left_align'>Analog Fx (Analog Functions)</th>
  </tr>
  <tr>
    <th>2 ... 3</th>
    <th class='left_align'>Speed Limit ZIMO / Speed Limit NMRA <br/>
        0b00 = Do not send Speed Limit, <br/>
        0b01 = Send NMRA Speed Limit <br/>
        0b10 = Send ZIMO Speed Limit</th>
  </tr>
  <tr>
    <th>4 ... 7</th>
    <th class='left_align'>Not defined</th>
  </tr>
</table>

## Sending

When sending command _0x01_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Vehicle address</th>
  </tr>
  <tr>
    <th>16 Bit</th>
  </tr>
</table>

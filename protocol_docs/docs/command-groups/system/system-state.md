---
id: system-state
title: System State
sidebar_position: 0
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="00" command="00"/>

The Command Group 0x00 summarizes all system 'High-Priority' commands and must be implemented by all boosters and drive consoles.

With Cmd=0x00/M=0b00 the power status of the respective device can be queried.

:::caution

A query immediately after a Power Command can lead to inconsistent answers! After a Power Mode Command the device (specified by NId, e.g.: MX10, StEin, ...)) changes to the desired mode, but this is only reported AFTER the internal control loops have executed the change and it is verified by measurements. This process can take several 100ms depending on the desired change!

:::

With Cmd=0x00/M=0b01 the port power status of the device can be set. The current status is 'acknowledged' by Cmd=0x00/M=0b11. The valid status is also included in the regular (approx. 500ms) power message.

The object ports are binary coded and this combinations are allowed:

<table>
  <tr>
    <th>Port</th>
    <th>Output</th>
  </tr>
  <tr>
    <th>0b00000001</th>
    <th class='left_align'>Rail 1</th>
  </tr>
  <tr>
    <th>0b00000010</th>
    <th class='left_align'>Rail 2</th>
  </tr>
  <tr>
    <th>0b0………. 00</th>
    <th class='left_align'>Track 3 ... 7 (Further MX10 in booster mode)
</th>
  </tr>
  <tr>
    <th>0b10000000</th>
    <th class='left_align'>Booster output, resp. track output 8 at MX9/StEin</th>
  </tr>
</table>

_Therefore, to switch ALL outputs with one command, port 255 (=0xFF, =0b111111) must be used._

:::caution

If several outputs are switched at the same time, the confirmation still takes place individually for each of the 'existing' ports. So if e.g.: no further MX10 is available in booster mode, there will be NO ACK for these non-existent rails!

:::

Applications (whether via PC interface or one of the internal bus systems) should ALWAYS wait for the ACK of the MX10 after a power mode change. ALWAYS wait for the respective ACK of the MX10, which basically makes a 'query' unnecessary.

## Receiving

When receiving command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Device NID</th>
    <th>Port</th>
    <th>Mode state</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

## Sending

When sending command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Device NID</th>
    <th>Port</th>
    <th>Mode state</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

---
id: module-power-info
title: Module Power Info
sidebar_position: 1
---

## Receiving [0x18, 0x00]

If a PC software/client has 'long' data-grams enabled, the MX10 sends its track status, current and voltage values in a 'long' data-gram.

When receiving command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Device NID</th>
    <th>Port 1</th>
    <th>Port 1 voltage</th>
    <th>Port 1 amperage</th>
    <th>Port 2</th>
    <th>Port 2 voltage</th>
    <th>Port 2 amperage</th>
    <th>Amperage 32V</th>
    <th>Amperage 12V</th>
    <th>Voltage total</th>
    <th>Temperature</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

The 'Device NID' is the Network Id of the queried device, or the Network Id of the source of the Power Info message. This can be (currently 2020.05.18) the master MX10(ec), MX10 booster or StEin[e].

:::info Recommendation

A PC software MUST be prepared to send more data bytes!!! Depending on future requirements the MX10 will send more status information.

:::

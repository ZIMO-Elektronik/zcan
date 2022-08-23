---
id: bidi-info
title: BiDi Info
sidebar_position: 1
---

## Receiving [0x08, 0x05]

When receiving command _0x05_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Type</th>
    <th>Data</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
  </tr>
</table>

With this data-gram the MX10 BiDi reports information The 'NID' indicates which device should answer the question. Typically this is the NID of the the PC is connected to. However, especially in a network, it can also be another device (e.g.: Tab, another PC).

### Type table

<table>
  <tr>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>0x0100</th>
    <th>BiDi Speed</th>
  </tr>
  <tr>
    <th>0x0101</th>
    <th>Tilt/Curve</th>
  </tr>
  <tr>
    <th>0x0200</th>
    <th>BiDi CV</th>
  </tr>
  <tr>
    <th>0x0300</th>
    <th>BiDi QoS</th>
  </tr>
  <tr>
    <th>0x0400</th>
    <th>BiDi Fill level</th>
  </tr>
  <tr>
    <th>0x0800</th>
    <th>BiDi Direction</th>
  </tr>
  <tr>
    <th>0x1000</th>
    <th>BiDi Track Voltage</th>
  </tr>
  <tr>
    <th>0x1100</th>
    <th>BiDi Alarms</th>
  </tr>
</table>

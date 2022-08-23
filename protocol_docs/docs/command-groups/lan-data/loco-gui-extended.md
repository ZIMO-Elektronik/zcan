---
id: loco-gui-extended
title: Loco Gui Extended
sidebar_position: 2
---

## Receiving [0x017, 0x27]

When receiving command _0x27_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Sub ID</th>
    <th>Vehicle group</th>
    <th>Name</th>
    <th>Image ID</th>
    <th>Tacho</th>
    <th>Speed forward</th>
    <th>Speed rev 🚧 What is this? (Rev as max rev on cars?)</th>
    <th>Speed range</th>
    <th>Drive type</th>
    <th>Era</th>
    <th>Country code</th>
    <th>Icons 🚧 What is done with icons?</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>26 Bytes</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>64 Bytes</th>
  </tr>
</table>

### Era parsing 🚧

:::caution Under construction🚧

Further description is needed! Is the era parsing needed and if so then explain

:::

### Functions 🚧

:::caution Under construction🚧

Further description is needed! Explain What is done with functions

:::

## Sending [0x017, 0x27]

When sending command _0x27_ the 'Data' section will look like this:

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

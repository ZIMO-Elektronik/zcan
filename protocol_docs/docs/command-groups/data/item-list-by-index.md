---
id: item-list-by-index
title: Item List By Index
sidebar_position: 2
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="01"/>

## Receiving

When receiving command _0x01_ the 'Data' section will look like this:

| Index  | Device NID | Last tick (ms) |
|--------|------------|----------------|
| 16 Bit | 16 Bit     | 16 Bit         |


By Mode = 0b00 a device can query the object list via the object index in the MX10. The MX10 responds (Mode = 0b11) with the object index and the NID of the object. This allows a device to build up a list of objects known to the MX10.

Case 1: Device present <br/>If there is an object in the MX10 under the requested index, it returns the index, the NId of the device and the number of mS since the last communication with the device. <br/>Case 2: Device not present/unknown <br/>If the MX10 does not know a device under the given index, it returns the requested index in the response, as NId=0xFFFF and also as last communication tick 0xFFFF.

Likewise, if the index is outside the 'object group' (e.g.: for MX8/MX9 only indexes from 0 ... 63 are allowed), device is unknown.

:::note

With this command a 'direct' memory access is performed. The object may or may not contain data (object). If a query on index e.g.: index 10 returns 'no data', then there may be some on Index 11.The response (M = 0b11) contains the 'next' NId, the corresponding index and, if available, the last 'communication bar'.

:::

## Sending

When sending command _0x01_ the 'Data' section will look like this:

| NID    | Group NID | Index  |
|--------|-----------|--------|
| 16 Bit | 16 Bit    | 16 Bit |


:::note

Mode should be set to 0b00.

:::

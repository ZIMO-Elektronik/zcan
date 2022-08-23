---
id: item-list-by-nid
title: Item List By NID
sidebar_position: 3
---

## Receiving [0x07, 0x02]

When receiving command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Index</th>
    <th>Item state</th>
    <th>Last tick (ms)</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

By Mode = 0b00 a device can query that NId which is stored after the specified NId. This command is especially helpful for accessory modules/decoders. The answer (Mode = 0b11) contains the 'next' NId, the respective index and if available the last 'communication tick'. Similar to 'Item List by Index' [0x07.0x01] there are 2 possible answers:

1. The MX10 finds a 'next' device after the given NId in the same object group. In this case it returns the found NId, the index and the last communication tick.
2. The MX10 does not know any other devices in the object group, the NId refers to an unknown object group, ... In this case the MX10 finds a 'next' device after the given NId. In this case the MX10 answers with NId=0xFFFF, Index=0xFFFF and LastTick=0xFFFF.

:::note

MX10 will return 'yes' answers if it finds more data and empty memory locations are skipped. The response (M = 0b11) contains the 'next' NId, the corresponding index and, if available, the last 'communication bar'.

:::

## Sending [0x07, 0x02]

When sending command _0x02_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Search after value</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::note

Mode should be set to 0b00.

:::

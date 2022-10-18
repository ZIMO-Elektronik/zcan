---
id: item-image-config
title: Item Image Config
sidebar_position: 5
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="12"/>

## Receiving

With the 'Data Image Config' data-grams the images can be transferred for each vehicle, accessory, device in the system.

When receiving command _0x12_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Type</th>
    <th>Image ID</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

:::tip

Vehicle images can also be retrieved or specified by ImageCRC32, the conversion to the ImageID must be calculated in the be calculated in the respective device. The 'source' for the ImageCRC32 is always the 'big' vehicle image (279x92 pixel, 16 (if MX32/FU calculated) or 24 (if PC calculated) bit colors).

:::

### Image Types

<table>
  <tr>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>0x01</th>
    <th>Vehicle image: Image ID</th>
  </tr>
  <tr>
    <th>0x02</th>
    <th>Vehicle image: Image CRC32</th>
  </tr>
  <tr>
    <th>0x03</th>
    <th>Vehicle speedometer: Image ID</th>
  </tr>
  <tr>
    <th>0x04</th>
    <th>🚧</th>
  </tr>
  <tr>
    <th>0x10</th>
    <th>Vehicle Instrument: Brake Bar</th>
  </tr>
  <tr>
    <th>0x1f</th>
    <th>Vehicle instrument</th>
  </tr>
</table>

## Sending

When sending command _0x12_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Type</th>
    <th>Image ID</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

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

| NID    | Type   | Image ID |
|--------|--------|----------|
| 16 Bit | 16 Bit | 16 Bit   |

:::tip

Vehicle images can also be retrieved or specified by ImageCRC32, the conversion to the ImageID must be calculated in the be calculated in the respective device. The 'source' for the ImageCRC32 is always the 'big' vehicle image (279x92 pixel, 16 (if MX32/FU calculated) or 24 (if PC calculated) bit colors).

:::

### Image Types

| Type | Description                   |
|------|-------------------------------|
| 0x01 | Vehicle image: Image ID       |
| 0x02 | Vehicle image: Image CRC32    |
| 0x03 | Vehicle speedometer: Image ID |
| 0x04 | 🚧                            |
| 0x10 | Vehicle Instrument: Brake Bar |
| 0x1f | Vehicle instrument            |

## Sending

When sending command _0x12_ the 'Data' section will look like this:

| NID    | Type   | Image ID |
|--------|--------|----------|
| 16 Bit | 16 Bit | 16 Bit   |

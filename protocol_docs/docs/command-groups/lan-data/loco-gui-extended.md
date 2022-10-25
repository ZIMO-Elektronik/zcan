---
id: loco-gui-extended
title: Loco Gui Extended
sidebar_position: 2
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="17" command="27"/>

## Receiving

When receiving command _0x27_ the 'Data' section will look like this:

| NID    | Sub ID | Vehicle group | Name     | Image ID | Tacho  | Speed forward | Speed rev 🚧 What is this? (Rev as max rev on cars?) | Speed range | Drive type | Era    | Country code | Icons 🚧 What is done with icons? |
|--------|--------|---------------|----------|----------|--------|---------------|------------------------------------------------------|-------------|------------|--------|--------------|-----------------------------------|
| 16 Bit | 16 Bit | 16 Bit        | 26 Bytes | 16 Bit   | 16 Bit | 16 Bit        | 16 Bit                                               | 16 Bit      | 16 Bit     | 16 Bit | 16 Bit       | 64 Bytes                          |

### Era parsing 🚧

:::caution Under construction🚧

Further description is needed! Is the era parsing needed and if so then explain

:::

### Functions 🚧

:::caution Under construction🚧

Further description is needed! Explain What is done with functions

:::

## Sending

When sending command _0x27_ the 'Data' section will look like this:

| Mx10 NID | NID    | 0      |
|----------|--------|--------|
| 16 Bit   | 16 Bit | 16 Bit |


:::note

Mode should be set to 0b00.

:::

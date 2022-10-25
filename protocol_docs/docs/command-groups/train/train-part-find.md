---
id: train-part-find
title: Train Part Find
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="05" command="02"/>

## Receiving

When receiving command _0x02_ the 'Data' section will look like this:

| NID    | Train NID | Owner NID | State  |
|--------|-----------|-----------|--------|
| 16 Bit | 16 Bit    | 16 Bit    | 16 Bit |


## Sending

When sending command _0x02_ the 'Data' section will look like this:

| NID    |
|--------|
| 16 Bit |


:::note

Mode should be set to 0b00.

:::

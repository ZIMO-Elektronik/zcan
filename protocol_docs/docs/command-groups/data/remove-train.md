---
id: remove-train
title: Remove Train
description: 0x07.0x1f
sidebar_position: 4
---
import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="1f"/>

## Receiving 

When receiving command the 'Data' section will look like this:

| NID    | State  |
|--------|--------|
| 16 Bit | 16 Bit |


## Sending

When sending command the 'Data' section will look like this:

| Remove from device with NID | NID of locomotive (or other device) to remove |
|-----------------------------|-----------------------------------------------|
| 16 Bit                      | 16 Bit                                        |


:::note

'Remove from NID' specifies which device should remove the train.

:::

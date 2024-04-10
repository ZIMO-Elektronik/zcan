---
id: loco-speedtab-extended
title: Loco SpeedTab Extended
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="17" command="19"/>

This command is only available on the PC interface (LAN).
This allows the vehicle speed tables to be queried or set.

|  Grp    |   Cmd   |    M    |   NID   |  DLC    |   DB1..2    |    BD3..4  |   DB5   |   BD6   |        DB7..n       |
|---------|---------|---------|---------|---------|-------------|------------|---------|---------|---------------------|
|   0x17  |  0x19   |   0b00  |         |    6    |    SrcID    |     NID    |    0    |    0    |                     |
|   0x17  |  0x19   |   0b11  |         |   18    |    SrcID    |     NID    |    0    |    3    | 3 Point Steps/Speed |

In the query you can specify which speed table should be queried or changed.
Tab = 0: MX3n standard table

This contains as many speed pairs as specified under 'Items'.


|          DB          |  Len  |               Contents            |
|----------------------|-------|-----------------------------------|
|  7..8/11..12/15..16  |   2   | Speed level scaled to 1024 levels |
|  9..10/13..14/17..18 |   2   |          Matching kmH             |
---
id: module-power-info
title: Module Power Info
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="18" command="00"/>

## Receiving

If a PC software/client has 'long' data-grams enabled, the MX10 sends its track status, current and voltage values in a 'long' data-gram.

When receiving command _0x00_ the 'Data' section will look like this:

| Device NID | Port 1 | Port 1 voltage | Port 1 amperage | Port 2 | Port 2 voltage | Port 2 amperage | Amperage 32V | Amperage 12V | Voltage total | Temperature |
|------------|--------|----------------|-----------------|--------|----------------|-----------------|--------------|--------------|---------------|-------------|
| 16 Bit     | 16 Bit | 16 Bit         | 16 Bit          | 16 Bit | 16 Bit         | 16 Bit          | 16 Bit       | 16 Bit       | 16 Bit        | 16 Bit      |
The 'Device NID' is the Network Id of the queried device, or the Network Id of the source of the Power Info message. This can be (currently 2020.05.18) the master MX10(ec), MX10 booster or StEin[e].

:::info Recommendation

A PC software MUST be prepared to send more data bytes!!! Depending on future requirements the MX10 will send more status information.

:::

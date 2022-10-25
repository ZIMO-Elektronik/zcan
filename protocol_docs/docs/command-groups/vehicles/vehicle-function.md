---
id: vehicle-function
title: Vehicle Function
sidebar_position: 2
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="04"/>

## Receiving

When receiving command _0x04_ the 'Data' section will look like this:

| NID    | Function number | Function state |
|--------|-----------------|----------------|
| 16 Bit | 16 Bit          | 16 Bit         |

If Mode = 0b00, then the function of the locomotive with 'NID' and the function 'No.' is queried. <br/> If Mode = 0b01, then the locomotive function 'Function number' of the locomotive 'NID' is set to the specified value. <br/> If Mode = 0b11, then the loco responds to a function value query. <br/> Where function state = 0x00 always means "Off" and function state not equal to 0x00 depends on the respective locomotive decoder. For "normal" DCC and MM locomotive decoders this is interpreted as the function being "On".

The 'Function number' is divided into several areas for this command:

| From function number | To function number | Description                                                                                 | Valid values |
|----------------------|--------------------|---------------------------------------------------------------------------------------------|--------------|
| 0                    | 31                 | The known 'normal' functions. The maximum function number depends on the respective format. | On/Off       |
| 256                  | 512                | 256 analog functions                                                                        | 0 ... 255    |
| 32768                | 65536              | Binary States (see NMRA 9.2.1)                                                              | On/Off       |

## Sending

When sending command _0x04_ the 'Data' section will look like this:

| Vehicle address | Function ID | Function status |
|-----------------|-------------|-----------------|
| 16 Bit          | 16 Bit      | 16 Bit          |


---
id: vehicle-mode
title: Vehicle Mode
sidebar_position: 0
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="02" command="01"/>

These data-grams are used to query or set the vehicle's operating mode. In order for the MX10 to control the vehicle, the operating parameters must be known. The operating parameters of the vehicle can/must be determined by the PC software! To do this, it can query them first and add only the "unknown" parameters, or simply send "your" parameters as a command. In any case, the MX10 works with the last defined (received) vehicle parameters and stores them on the end of operation.

## Receiving

When receiving command _0x01_ the 'Data' section will look like this:

| NID    | Mode1 | Mode2 | Mode3 |
|--------|-------|-------|-------|
| 16 Bit | 8 Bit | 8 Bit | 8 Bit |


Mode=0b00 allows the control unit to query the current operating parameters for a vehicle. With a response with M1=0x00 and M2=0x00 the respective vehicle is unknown to the MX10.

### Mode 1 flags

| Bit     | Meaning                                                                                                                        |
|---------|--------------------------------------------------------------------------------------------------------------------------------|
| 0 ... 3 | **Speed Steps:** <br/> 0: 'unknown<br/> 1: 14FS<br/> 2: 27FS<br/> 3: 28FS<br/> 4: 128FS<br/> 5: 1024FS<br/> 6 - 7: not defined |
| 4 ... 7 | **Operating mode:** <br/> 0: unknown<br/> 1: DCC<br/> 2: MM2<br/> 3: not defined<br/> 4: mfx<br/> 7: System Use                |

### Mode 2 flags

| Bit     | Meaning                                                 |
|---------|---------------------------------------------------------|
| 0 ... 7 | Max. Number of functions: None (0) to currently max. 32 |


### Mode 3 flags

| Bit     | Meaning                                                                                                                                            |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| 0       | Pulse Fx (functions are thus sent pulse chain, LGB)                                                                                                |
| 1       | Analog Fx (Analog Functions)                                                                                                                       |
| 2 ... 3 | **Speed Limit SIMO / Speed Limit NMRA**<br/>  0b00 = Do not send Speed Limit<br/>  0b01 = Send NMRA Speed Limit<br/>  0b10 = Send ZIMO Speed Limit |
| 4 ... 7 | Not defined                                                                                                                                        |


## Sending

When sending command _0x01_ the 'Data' section will look like this:

| Vehicle address |
|-----------------|
| 16 Bit          |


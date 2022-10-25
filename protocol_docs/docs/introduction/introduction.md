---
id: introduction
title: Overview
sidebar_position: 0
---

## Protocol

The currently used ZIMO CAN protocol is now quite old (> 10 years) and has grown historically. It is therefore hardly possible to adapt this protocol to new requirements. For this reason, the devices of the Zs series (2010) will use a new extended protocol in parallel to the current CAN protocol (ZCAN10).

The MX10 supports both protocols on its two CAN sockets. The CAN sockets labeled ZIMO use the 'old' protocol by default, while the sockets from other devices use the new CAN protocol. However, this can be changed in the MX10 menu at any time as required.

## Layer 7

So that a model railroad can actually be controlled, a layer-7 (application) must also be defined. The Layer-7 definition contains the definition of the 29Bit ID's and the 8 data bytes. So that such a CAN protocol works properly, it must be ensured that the 29Bit ID's of the CAN bus are unique system-wide.

Practically all CAN controllers can mask and/or filter the CAN ID. By a CAN ID's it is possible to filter all CAN messages in such a way, that the respective device only has to process those messages which are really relevant. A turnout decoder for example does not get 'locomotive commands' at all. Conversely, a booster does not need to worry about 'switching commands'.

## Addressing

In the following, the term "object" is often used. By this term you can imagine any "addressable" thing on a model railway. In particular, it does not matter whether it is a vehicle, a switch or a USB key. All that matters is that such an object has a unique address (UID) in the active system and a few basic properties.

Of course, specific objects have, in addition to their basic properties, "custom" properties that are valid only for this one object. For historical reasons, a distinction has to be made between "legacy objects" and ZCAN20 objects. Legacy Objects (DCC locomotive / turnout decoder, ...) do not have their own UIDs and their properties are mostly distributed in different CVs, or partially not available. ZCAN20 objects (but also ESU/Märklin) have a unique UID and also the necessary basic properties. In order to be able to use also common decoders and devices, there must be a management system that simulates the ZCAN20 objects to the rest of the system by means of computation, stored configurations, etc. In this way, even "legacy/conventional" decoders and other devices behave as ZCAN20 objects.

## Translate Table For Legacy Devices:

| UID Word1 | UID Word2 Min. | UID Word2 Max | Available Addresses |                                  |
|-----------|----------------|---------------|---------------------|----------------------------------|
| 0x0000    | 0x0000         | 0x27FF        | 10240               | DCC Locomotives                  |
| 0x0000    | 0x2800         | 0x28FF        | 256                 | MM1/MM2 Locomotives              |
| 0x0000    | 0x2900         | 0x2EFF        | 3072                | Available [1]                    |
| 0x0000    | 0x2F00         | 0x2FFF        | 256                 | Multi-tractions                  |
| 0x0000    | 0x3000         | 0x31FF        | 512                 | DCC 'Basic' Accessory Decoder    |
| 0x0000    | 0x3200         | 0x39FF        | 2058                | DCC 'Extended' Accessory Decoder |
| 0x0000    | 0x3A00         | 0x3DFF        | 1024                | MM1 Accessory Decoder            |
| 0x0000    | 0x4000         | 0x43FF        | 1024                | S88 Feedback                     |
| 0x0000    | 0x4400         | 0x45FF        | 1024                | X-Net Decoder                    |
| 0x0000    | 0x4600         | 0x47FF        | 1024                | X-Net Feedback                   |
| 0x0000    | 0x4800         | 0x4FFF        | 2048                | Available [2]                    |

### ZIMO Device Generation 1
| UID Word1 | UID Word2 Min. | UID Word2 Max | Available Addresses |                                          |
|-----------|----------------|---------------|---------------------|------------------------------------------|
| 0x0000    | 0x5000         | 0x503F        | 64                  | MX1                                      |
| 0x0000    | 0x5040         | 0x507F        | 64                  | MX8 Module, Channel 1                    |
| 0x0000    | 0x5080         | 0x50BF        | 64                  | MX9 Module, Channel 1                    |
| 0x0000    | 0x50C0         | 0x50CF        | 16                  | CSA Module                               |
| 0x0000    | 0x50D0         | 0x50DF        | 16                  | MX31                                     |
| 0x0000    | 0x5100         | 0x513F        | 64                  | MX8 Module, Channel 2                    |
| 0x0000    | 0x5140         | 0x517F        | 64                  | MX9 Module, Channel 2                    |
| 0x0000    | 0x5800         | 0x5800        | 128                 | I2C eXtender, Differentiation see SubCmd |
| 0x0000    | 0x5A00         | 0x5AFF        | 256                 | Block locations                          |


### ZIMO System Database

| UID Word2 Min. | UID Word2 Max                       | Available Addresses |                |
|----------------|-------------------------------------|---------------------|----------------|
| 0x6000         | 0x60FF  Panels / GBS / Signal boxes |
| 0x6100         | 0x63FF                              | 768                 | Routes         |
| 0x6400         | 0x65FF                              |                     |                |
| 0x6600         | 0x66FF                              | 256                 | Sound Projects |
| 0x6700         | 0x7FFF                              |                     | Reserved       |


### Mfx Addresses

| UID Word1 | UID Word2 Min. | UID Word2 Max | Available Addresses |                 |
|-----------|----------------|---------------|---------------------|-----------------|
| 0x0000    | 0x8000         | 0xBFFF        | 16384               | Mfx Locomotives |

### ZIMO CAN 2.xx devices (Also from non ZIMO manufacturers)
| UID Word2 Min. | UID Word2 Max | Available Addresses |                              |
|----------------|---------------|---------------------|------------------------------|
| 0xC000         | 0xC0FF        | 256                 | MX10 Central                 |
| 0xC100         | 0xC1FF        | 256                 | MX10 Booster                 |
| 0xC200         | 0xC2FF        | 256                 | Special equipment (IF, ....) |
| 0xC300         | 0xC3FF        | 256                 | Driving consoles             |
| 0xC400         | 0xC4FF        | 256                 | MX32 Radio modules           |
| 0xD000         | 0xDFFF        | 4096                | Module                       |
| 0xE000         | 0xEFFF        | 4096                | Object                       |
| 0xF000         | 0xFFFF        | 4096                | Files                        |

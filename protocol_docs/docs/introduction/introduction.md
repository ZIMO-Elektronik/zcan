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

<table>
  <tr>
    <th>UID Word1</th>
    <th>UID Word2 Min.</th>
    <th>UID Word2 Max</th>
    <th>Available Addresses</th>
    <th> </th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x0000</th>
    <th>0x27FF</th>
    <th>10240</th>
    <th class='left_align'>DCC Locomotives</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th> 0x2800</th>
    <th>0x28FF</th>
    <th>256</th>
    <th class='left_align'>MM1/MM2 Locomotives</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x2900</th>
    <th>0x2EFF</th>
    <th>3072</th>
    <th class='left_align'>Available [1]</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x2F00</th>
    <th>0x2FFF</th>
    <th>256</th>
    <th class='left_align'>Multi-tractions</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x3000</th>
    <th>0x31FF</th>
    <th>512</th>
    <th class='left_align'>DCC 'Basic' Accessory Decoder</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x3200</th>
    <th>0x39FF</th>
    <th>2058</th>
    <th class='left_align'>DCC 'Extended' Accessory Decoder</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x3A00</th>
    <th>0x3DFF</th>
    <th>1024</th>
    <th class='left_align'>MM1 Accessory Decoder</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x4000</th>
    <th>0x43FF</th>
    <th>1024</th>
    <th class='left_align'>S88 Feedback</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x4400</th>
    <th>0x45FF</th>
    <th>1024</th>
    <th class='left_align'>X-Net Decoder</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x4600</th>
    <th>0x47FF</th>
    <th>1024</th>
    <th class='left_align'>X-Net Feedback</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x4800</th>
    <th>0x4FFF</th>
    <th>2048</th>
    <th class='left_align'>Available [2]</th>
  </tr>
</table>

### ZIMO Device Generation 1

<table>
  <tr>
    <th>UID Word1</th>
    <th>UID Word2 Min.</th>
    <th>UID Word2 Max</th>
    <th>Available Addresses</th>
    <th> </th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5000</th>
    <th>0x503F</th>
    <th>64</th>
    <th class='left_align'>MX1</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5040</th>
    <th>0x507F</th>
    <th>64</th>
    <th class='left_align'>MX8 Module, Channel 1</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5080</th>
    <th>0x50BF</th>
    <th>64</th>
    <th class='left_align'>MX9 Module, Channel 1</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x50C0</th>
    <th>0x50CF</th>
    <th>16</th>
    <th class='left_align'>CSA Module</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x50D0</th>
    <th>0x50DF</th>
    <th>16</th>
    <th class='left_align'>MX31</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5100</th>
    <th>0x513F</th>
    <th>64</th>
    <th class='left_align'>MX8 Module, Channel 2</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5140</th>
    <th>0x517F</th>
    <th>64</th>
    <th class='left_align'>MX9 Module, Channel 2</th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x5800</th>
    <th>0x5800</th>
    <th>128</th>
    <th class='left_align'>I2C eXtender, Differentiation see SubCmd</th>
  </tr>
  <tr>
    <th></th>
    <th>0x5A00</th>
    <th>0x5AFF</th>
    <th>256</th>
    <th class='left_align'>Block locations</th>
  </tr>
</table>

### ZIMO System Database

<table>
  <tr>
    <th>UID Word2 Min.</th>
    <th>UID Word2 Max</th>
    <th>Available Addresses</th>
    <th> </th>
  </tr>
  <tr>
    <th>0x6000</th>
    <th>0x60FF</th>
    <th>256</th>
    <th class='left_align'>Panels / GBS / Signal boxes </th>
  </tr>
  <tr>
    <th>0x6100</th>
    <th>0x63FF</th>
    <th>768</th>
    <th class='left_align'>Routes</th>
  </tr>
  <tr>
    <th>0x6400</th>
    <th>0x65FF </th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <th>0x6600</th>
    <th>0x66FF</th>
    <th>256</th>
    <th class='left_align'>Sound Projects</th>
  </tr>
  <tr>
    <th>0x6700</th>
    <th>0x7FFF</th>
    <th></th>
    <th class='left_align'>Reserved</th>
  </tr>
</table>

### Mfx Addresses

<table>
  <tr>
    <th>UID Word1</th>
    <th>UID Word2 Min.</th>
    <th>UID Word2 Max</th>
    <th>Available Addresses</th>
    <th> </th>
  </tr>
  <tr>
    <th>0x0000</th>
    <th>0x8000</th>
    <th>0xBFFF</th>
    <th>16384</th>
    <th>Mfx Locomotives</th>
  </tr>
</table>

### ZIMO CAN 2.xx devices (Also from non ZIMO manufacturers)

<table>
  <tr>
    <th>UID Word2 Min.</th>
    <th>UID Word2 Max</th>
    <th>Available Addresses</th>
    <th> </th>
  </tr>
  <tr>
    <th>0xC000</th>
    <th>0xC0FF</th>
    <th>256</th>
    <th class='left_align'>MX10 Central</th>
  </tr>
  <tr>
    <th>0xC100</th>
    <th>0xC1FF</th>
    <th>256</th>
    <th class='left_align'>MX10 Booster</th>
  </tr>
  <tr>
    <th>0xC200</th>
    <th>0xC2FF</th>
    <th>256</th>
    <th class='left_align'>Special equipment (IF, ....)</th>
  </tr>
  <tr>
    <th>0xC300</th>
    <th>0xC3FF</th>
    <th>256</th>
    <th class='left_align'>Driving consoles</th>
  </tr>
  <tr>
    <th>0xC400</th>
    <th>0xC4FF</th>
    <th>256</th>
    <th class='left_align'>MX32 Radio modules</th>
  </tr>
  <tr>
    <th>0xD000</th>
    <th>0xDFFF</th>
    <th>4096</th>
    <th class='left_align'>Module</th>
  </tr>
  <tr>
    <th>0xE000</th>
    <th>0xEFFF</th>
    <th>4096</th>
    <th class='left_align'>Object</th>
  </tr>
  <tr>
    <th>0xF000</th>
    <th>0xFFFF</th>
    <th>4096</th>
    <th class='left_align'>Files</th>
  </tr>
</table>

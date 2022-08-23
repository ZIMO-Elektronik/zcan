---
id: command-groups
title: Commands
sidebar_position: 0
---

## Receiving and sending commands

There are a few things to watch out for when receiving and sending orders. First, this is what the received message will look like. Also when sending, the message must be in the same format as the received message and the mode will be **0b01**.

<table>
  <tr>
    <th>Size</th>
    <th>Unused</th>
    <th>Group</th>
    <th>Cmd + Mode</th>
    <th>NID</th>
    <th>Data</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit<br/>first half = cmd <br/> second half = mode</th>
    <th>16 Bit</th>
    <th>0 ... x Bit</th>
  </tr>
</table>

:::note

In every group the 'Data' section is used for further parsing of information! <br/> When receiving the message everything will be in byte version! <br/> When creating the message everything has to be changed to byte version!

:::

## Command group table

Every message contains group code for better handling of commands. All commands are grouped in the following groups:

<table>
  <tr>
    <th>Group</th>
    <th>Code</th>
    <th>Use/Content</th>
  </tr>
  <tr>
    <th>System</th>
    <th>0x00</th>
    <th class='left_align'>System critical tasks (on/off, emergency stop, ...)</th>
  </tr>
  <tr>
    <th>Accessories</th>
    <th>0x01</th>
    <th class='left_align'>Commands for controlling the accessories.<br/>
This refers to both encoders/feedback devices and decoders.</th>
  </tr>
  <tr>
    <th>Vehicles</th>
    <th>0x02</th>
    <th class='left_align'>Commands for controlling the vehicles (Mobile Decoder)</th>
  </tr>
  <tr>
    <th>Free</th>
    <th>0x03</th>
    <th class='left_align'>Currently still unused</th>
  </tr>
  <tr>
    <th>GBS</th>
    <th>0x04</th>
    <th class='left_align'>Telegrams for track diagram control panels</th>
  </tr>
  <tr>
    <th>Train control</th>
    <th>0x05</th>
    <th class='left_align'>Configuration of devices, ZIMO Command Language</th>
  </tr>
  <tr>
    <th>Track config</th>
    <th>0x16</th>
    <th class='left_align'>Configuration of 'Track' accessories</th>
  </tr>
  <tr>
    <th>Data</th>
    <th>0x07</th>
    <th class='left_align'>Object data transfer</th>
  </tr>
  <tr>
    <th>Info</th>
    <th>0x08</th>
    <th class='left_align'>Status messages, mostly unrequested messages</th>
  </tr>
  <tr>
    <th>Free</th>
    <th>0x09</th>
    <th class='left_align'>May be used by third-party systems as required</th>
  </tr>
  <tr>
    <th>Network</th>
    <th>0x0A</th>
    <th class='left_align'>Network Management, Module Registration, ...</th>
  </tr>
  <tr>
    <th>File Control</th>
    <th>0x0E</th>
    <th class='left_align'>E Control commands for file transfer such as: File Open, Close, ...</th>
  </tr>
  <tr>
    <th>File Transfer</th>
    <th>0x0F</th>
    <th class='left_align'>File 'Contents' (data) Telegrams</th>
  </tr>
  <tr>
    <th>PC data-grams</th>
    <th>0x0n</th>
    <th class='left_align'>To optimize the data throughput between a PC application and the MX10,<br/> there are some specific data-grams</th>
  </tr>
  <tr>
    <th>Lan Data</th>
    <th>0x17</th>
    <th class='left_align'>🚧 Add description</th>
  </tr>
  <tr>
    <th>Lan Info</th>
    <th>0x18</th>
    <th class='left_align'>🚧 Add description</th>
  </tr>
</table>

:::caution Under construction🚧

Add missing description <br/> Check other descriptions

:::

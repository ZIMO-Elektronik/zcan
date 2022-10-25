---
id: command-groups
title: Commands
sidebar_position: 0
---

## Receiving and sending commands

There are a few things to watch out for when receiving and sending orders. First, this is what the received message will look like. Also when sending, the message must be in the same format as the received message and the mode will be **0b01**.

| Size   | Unused | Group | Cmd + Mode                                | NID    | Data        |
|--------|--------|-------|-------------------------------------------|--------|-------------|
| 16 Bit | 16 Bit | 8 Bit | 8 Bitfirst half = cmd  second half = mode | 16 Bit | 0 ... x Bit |


:::note

In every group the 'Data' section is used for further parsing of information! <br/> When receiving the message everything will be in byte version! <br/> When creating the message everything has to be changed to byte version!

:::

## Command group table

Every message contains group code for better handling of commands. All commands are grouped in the following groups:

| Group                                                       | Code | Use/Content                                                                                               |
|-------------------------------------------------------------|------|-----------------------------------------------------------------------------------------------------------|
| System                                                      | 0x00 | System critical tasks (on/off, emergency stop, ...)                                                       |
| Accessories                                                 | 0x01 | Commands for controlling the accessories.                                                                 |
| This refers to both encoders/feedback devices and decoders. |      |                                                                                                           |
| Vehicles                                                    | 0x02 | Commands for controlling the vehicles (Mobile Decoder)                                                    |
| Free                                                        | 0x03 | Currently still unused                                                                                    |
| GBS                                                         | 0x04 | Telegrams for track diagram control panels                                                                |
| Train control                                               | 0x05 | Configuration of devices, ZIMO Command Language                                                           |
| Track config                                                | 0x16 | Configuration of 'Track' accessories                                                                      |
| Data                                                        | 0x07 | Object data transfer                                                                                      |
| Info                                                        | 0x08 | Status messages, mostly unrequested messages                                                              |
| Free                                                        | 0x09 | May be used by third-party systems as required                                                            |
| Network                                                     | 0x0A | Network Management, Module Registration, ...                                                              |
| File Control                                                | 0x0E | E Control commands for file transfer such as: File Open, Close, ...                                       |
| File Transfer                                               | 0x0F | File 'Contents' (data) Telegrams                                                                          |
| PC data-grams                                               | 0x0n | To optimize the data throughput between a PC application and the MX10, there are some specific data-grams |
| Lan Data                                                    | 0x17 | 🚧 Add description                                                                                        |
| Lan Info                                                    | 0x18 | 🚧 Add description                                                                                        |

:::caution Under construction🚧

Add missing description <br/> Check other descriptions

:::

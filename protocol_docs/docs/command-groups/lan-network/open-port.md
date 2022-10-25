---
id: open-port
title: Open Port
sidebar_position: 1
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="1a" command="0e"/>

## Receiving

When receiving command _0x0e_ , NID is used from message data-gram for connection!

## Sending

When sending command _0x0e_ the 'Data' section will look like this:

| Options | App code | App name    |
|---------|----------|-------------|
| 32 Bit  | 32 Bit   | 0 ... x Bit |


With this data-gram a device can 'open' the Ethernet interface of the MX10. In response, the device receives a 'ping' from the MX10.

With length '0' a simple 'Open' of the interface takes place, further specifications are not necessary.

If length is greater than 8, then:

- The first 4 bytes contain options
- In the bytes 5 ... 8 an application identifier (unique program identifier) follows. After that up to 24 characters can be sent as application name.
- This name is used in various displays on MX10 and MX32.

If NO name is sent, the 32 bit identifier is displayed, if this is not sent either, then simply 'PC control' is displayed. This is especially user unfriendly for larger systems.

### Options

| Bit       | Content                          |
|-----------|----------------------------------|
| 0         | Long message                     |
| 1         | Free                             |
| 2 ... 7   | Multi list                       |
| 8 ... 22  | Free                             |
| 23        | Connection lost ➔ Stop all locos |
| 24        | Debug Output                     |
| 25 ... 31 | Free                             |


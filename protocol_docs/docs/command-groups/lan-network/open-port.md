---
id: open-port
title: Open Port
sidebar_position: 1
---

## Receiving [0x1a, 0x0e]

When receiving command _0x0e_ , NID is used from message data-gram for connection!

## Sending [0x1a, 0x0e]

When sending command _0x0e_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Options</th>
    <th>App code</th>
    <th>App name</th>
  </tr>
  <tr>
    <th>32 Bit</th>
    <th>32 Bit</th>
    <th>0 ... x Bit</th>
  </tr>
</table>

With this data-gram a device can 'open' the Ethernet interface of the MX10. In response, the device receives a 'ping' from the MX10.

With length '0' a simple 'Open' of the interface takes place, further specifications are not necessary.

If length is greater than 8, then:

- The first 4 bytes contain options
- In the bytes 5 ... 8 an application identifier (unique program identifier) follows. After that up to 24 characters can be sent as application name.
- This name is used in various displays on MX10 and MX32.

If NO name is sent, the 32 bit identifier is displayed, if this is not sent either, then simply 'PC control' is displayed. This is especially user unfriendly for larger systems.

### Options

<table>
  <tr>
    <th>Bit</th>
    <th>Content</th>
  </tr>
  <tr>
    <th>0</th>
    <th>Long message</th>
  </tr>
  <tr>
    <th>1</th>
    <th>Free</th>
  </tr>
  <tr>
    <th>2 ... 7</th>
    <th>Multi list</th>
  </tr>
  <tr>
    <th>8 ... 22</th>
    <th>Free</th>
  </tr>
  <tr>
    <th>23</th>
    <th>Connection lost ➔ Stop all locos</th>
  </tr>
  <tr>
    <th>24</th>
    <th>Debug Output</th>
  </tr>
  <tr>
    <th>25 ... 31</th>
    <th>Free</th>
  </tr>
</table>

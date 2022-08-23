---
id: interface
title: Interface
sidebar_position: 2
---

## PC interface

The connection to the PC can be made via Virtual (USB) Com-Port or Ethernet. In both cases the (CAN) protocol described here is used. Please note:

1. Each command has a data length specification, this must be adhered to. The length ALWAYS refers to the user data, not to the header/tail or the command identification. (Size, Group, Cmd, Mode, ...).
2. With a few exceptions, the protocol corresponds to the internally used CAN protocol. Therefore max. 8 data bytes are used.
3. To optimize the communication with the PC, there are some commands (Group 0x10 ... 0x1F), which can transfer up to 256 data bytes.

## PC USB interface

The CAN data-grams are transferred between the ZIMO system USB interface and the PC using the following method

### Establishing / initializing the connection

If the PC wants to establish a connection, it must initialize the establishment by sending the string 'Z22Z' (=0x5A, 0x32, 0x32, 0x5A) to initialize the connection. Only after the MX10 has 'understood' such a string, it responds with a 'ping' telegram. a 'ping' telegram. If the ping fails for more than 500mS, the setup ring must be repeated. If there is no ping even after the third attempt, an error must be assumed.

### Structure of the data telegrams for the zimo 2.x format for virtual com

For the new CAN protocol the characters 'Z2' / '2Z' are used as telegram delimiter. In this case the CAN ID is transmitted field by field (Group, Direction, Command and NID).

<table>
  <tr>
    <th>Header</th>
    <th>Size (DLC)</th>
    <th>Group</th>
    <th>Cmd + Mode</th>
    <th>NID</th>
    <th>Data 0 ... 8</th>
    <th>CRC16</th>
    <th>Tail</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>16 Bit</th>
    <th>8 x 8 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
  <tr>
    <th>0x5A32</th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th>0x325A</th>
  </tr>
</table>

CAN data-grams are essentially sent 1:1 within the frame defined above. However, since the USB (VCom) connection does not have a fixed limit of 8 data bytes, larger data-grams can be sent or received.

:::note

CRC16: When using a USB (Virtual COM Port) interface the value 0x0000 (CRC Ignore) can be used as CRC16. because the USB hardware already takes care for an error free transmission.

:::

## Ethernet/udp interface

The Ethernet interface uses basically the same method for data transfer. The app layer data transfer is done in the Ethernet (LAN/W-LAN) via IP/UDP frames. A PC software (or App) sends its requests/commands via the UDP port 14520 to the MX10, the answers of the MX10 arrive at the PC, Tab, ... at port 14521.

To initiate the connection the application must send a port 'Open' ([0x0A.0x06 or 0x1A.0x06]) to the MX10.

:::note

The ports can also be set to other values on the MX10, please refer to MX10 manual.

:::

### Structure of the data telegrams for the zimo 2.x format via udp

For the data-gram transmission in the Ethernet no delimiters are necessary ('Z2' ... '2Z') because this is covered by the Ethernet frame logic. As with the USB (VCom) interface, the data is transferred 1:1 in the Ethernet as on the CAN bus. But there are some additional Ethernet data-grams, which can transfer much more data to the system. MX10 can send more data in one data-gram to the PC. These LAN special commands are listed separately.

<table>
  <tr>
    <th>Size (DLC)</th>
    <th>Unused</th>
    <th>Group</th>
    <th>Cmd + Mode </th>
    <th>NID</th>
    <th>Data 0 ... x</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>8 Bit</th>
    <th>8 Bit</th>
    <th>16 Bit</th>
    <th></th>
  </tr>
</table>

Since an Ethernet frame typically comprises 1536 bytes, the length specification has increased to 16 bits compared to the VCom interface. bit compared to the VCom interface. Additionally, there is a currently unused 16 bit field. This is intended for later extensions.

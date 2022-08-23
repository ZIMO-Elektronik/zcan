---
id: how-it-works
title: How It Works
sidebar_position: 1
---

## General structure of the message

The command groups are structured in such a way that the respective CAN devices can use them as a filter criterion and thus do not have to evaluate all messages on the CAN bus.

The use of the data bytes depends on the respective command. As far as reasonable, they are used in the following order:

1. Destination ID Used when a specific device is to be addressed (e.g.: A turnout, a feedback device or a locomotive).
2. Remaining data bytes These are used differently depending on the command; the exact use is listed with the individual commands.

<table>
  <tr>
    <th>ID Command Group</th>
    <th>Counter</th>
    <th>Data Byte 1</th>
    <th>Data Byte 2</th>
    <th>Data Byte 3</th>
    <th>Data Byte 4</th>
    <th>Data Byte 5</th>
    <th>Data Byte 6</th>
    <th>Data Byte 7</th>
    <th>Data Byte 8</th>
  </tr>
  <tr>
    <th>Command Group</th>
    <th></th>
    <th colspan="2">[Target ID]</th>
    <th colspan="6">[More data after command]</th>
  </tr>
</table>

## Basic ID structure:

All 29 ID bits are shown in sequence, the 'CAN' internal flags are not shown.

<table>
  <tr>
    <th>Bit 0 ... 15</th>
    <th>Bit 16 / 17</th>
    <th>Bit 18 ... 23</th>
    <th>Bit 24 ... 27</th>
    <th>Bit 28</th>
  </tr>
  <tr>
    <th>16</th>
    <th>2</th>
    <th>6</th>
    <th>4</th>
    <th>1</th>
  </tr>
  <tr>
    <th>Network ID</th>
    <th>Mode</th>
    <th>Command</th>
    <th>Group</th>
    <th>Flag ('1')</th>
  </tr>
  <tr>
    <th>File ID</th>
    <th colspan="2">Counter</th>
    <th>Group</th>
    <th>Flag ('1')</th>
  </tr>
</table>

### Description of bit fields

ID field distribution for requests, commands, events and confirmations

<table>
  <tr>
    <th>Flag</th>
    <th class='left_align'>Always '1', serves to distinguish other protocols</th>
  </tr>
  <tr>
    <th>Group</th>
    <th class='left_align'>
      4 bits for the respective command group.<br />
      Indicates the respective Command Group (Sys, FeedBack, Loco, ...)
    </th>
  </tr>
  <tr>
    <th>Cmd</th>
    <th class='left_align'>This 6 bit field contains the respective command</th>
  </tr>
  <tr>
    <th>Mode</th>
    <th class='left_align'>
      0b00: Req (Queries)<br />
      0b01: Cmd (control commands, set value, ....)<br />
      0b10: Evt (Events = Unsolicited information)<br />
      0b11: ACK (Confirmation)
    </th>
  </tr>
  <tr>
    <th>NetworkID</th>
    <th class='left_align'>Identification number of the 'sender'. Primarily necessary to avoid collisions at the bus.</th>
  </tr>
</table>

ID field division for file transfer

<table>
  <tr>
    <th>Flag</th>
    <th class='left_align'>Always '1', serves to distinguish other protocols</th>
  </tr>
  <tr>
    <th>Group</th>
    <th class='left_align'>0x0F (File Transfer)</th>
  </tr>
  <tr>
    <th>Counter</th>
    <th class='left_align'>8 bit telegram counter</th>
  </tr>
  <tr>
    <th>File ID</th>
    <th class='left_align'>File ID</th>
  </tr>
</table>

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
  <thead>
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
  </thead>
  <tbody>
    <tr>
      <td>Command Group</td>
      <td></td>
      <td colspan="2">[Target ID]</td>
      <td colspan="6">[More data after command]</td>
    </tr>
  </tbody>
</table>

## Basic ID structure:

All 29 ID bits are shown in sequence, the **CAN** internal flags are not shown.

| Bit 0 ... 15 | Bit 16 / 17 | Bit 18 ... 23 | Bit 24 ... 27 | Bit 28   |
|--------------|-------------|---------------|---------------|----------|
| 16           | 2           | 6             | 4             | 1        |
| Network ID   | Mode        | Command       | Group         | Flag '1' |


### Description of bit fields

Field distribution for requests, commands, events and confirmations

| Field     | Description                                                                                                      |
|-----------|------------------------------------------------------------------------------------------------------------------|
| Flag      | Always '1', serves to distinguish other protocols                                                                |
| Group     | 4 bits for the respective command group. Indicates the respective Command Group (Sys, FeedBack, Loco, ...)       |
| Cmd       | This 6 bit field contains the respective command                                                                 |
| Mode      | 0b00: Request information <br/> 0b01: Control commands, Set values, etc. <br/> 0b10: Events <br/> 0b11: Response |
| NetworkID | Identification number of the 'sender'. Primarily necessary to avoid collisions at the bus.                       |

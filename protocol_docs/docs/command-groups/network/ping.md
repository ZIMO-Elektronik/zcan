---
id: ping
title: Ping
sidebar_position: 1
---

## Receiving [0x0a, 0x00]

When receiving command _0x00_ you use the NID provided in the message!

With a ping request devices can ask other devices on the CAN bus to respond with a ping ack. This allows each device to check whether the other device(s) is/are present. The NId of a specific device can be specified in the request. In this case the device answers immediately, the sender can therefore assume after approx. 100mS that the device is responding or is not available at the moment. If instead of a concrete NId a group NId (e.g. 0xD000 for new modules) is requested, all devices of this group will answer with a random NId. devices of this group answer with a random delay of up to 1000mS.

All devices should send a ping regularly! The following criteria should be observed:

- After starting the device should ping at least once within the first second.
- The time intervals should have a deliberate jitter by a random value.
- At low CAN bus load each module should send one ping between 500 and 1000mS.

**Exceptions** (slower ping):

- At high CAN bus utilization (> 500 messages/second) pings should be omitted. In any case one ping must be sent every 5000mS.
- If the device itself has many messages to send, the ping can also be omitted.
- In any case, each device MUST send at least ONE message every 5000mS on the CAN bus that is VALID!!!

The primary control panel sends this command approximately every 500ms, but at least every second.

With this command, the connected modules should recognize that they are still connected to the known control panel. The session number must also be checked. This session number is incremented by the central unit with every UID change. This happens e.g.: when the control panel adds a new object to your object list or when an existing object is removed. or if an existing object is deleted from this list. If a module detects that it is connected to an 'unknown' control center, it must initiate a login process.

## Sending [0x0a, 0x00]

When sending command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Mx10 NID</th>
  </tr>
  <tr>
    <th>16 Bit</th>
  </tr>
</table>

## Sending [0x0a, 0x07]

When sending command _0x00_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Mx10 NID</th>
  </tr>
  <tr>
    <th>16 Bit</th>
  </tr>
</table>

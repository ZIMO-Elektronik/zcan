---
id: vehicle-function
title: Vehicle Function
sidebar_position: 2
---

## Receiving [0x02, 0x04]

When receiving command _0x04_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Function number</th>
    <th>Function state</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

If Mode = 0b00, then the function of the locomotive with 'NID' and the function 'No.' is queried. <br/> If Mode = 0b01, then the locomotive function 'Function number' of the locomotive 'NID' is set to the specified value. <br/> If Mode = 0b11, then the loco responds to a function value query. <br/> Where function state = 0x00 always means "Off" and function state not equal to 0x00 depends on the respective locomotive decoder. For "normal" DCC and MM locomotive decoders this is interpreted as the function being "On".

The 'Function number' is divided into several areas for this command:

<table>
  <tr>
    <th>From function number</th>
    <th>To function number</th>
    <th>Description</th>
    <th>Valid values</th>
  </tr>
  <tr>
    <th>0</th>
    <th>31</th>
    <th class='left_align'>The known 'normal' functions. The maximum function
number depends on the respective format.</th>
    <th>On/Off</th>
  </tr>
  <tr>
    <th>256</th>
    <th>512</th>
    <th class='left_align'>256 analog functions</th>
    <th>0 ... 255</th>
  </tr>
  <tr>
    <th>32768</th>
    <th>65536</th>
    <th class='left_align'>Binary States <a href="http://www.nmra.org/sites/default/files/s-9.2.1_2012_07.pdf">(see NMRA 9.2.1)</a></th>
    <th>On/Off</th>
  </tr>
</table>

## Sending [0x02, 0x04]

When sending command _0x04_ the 'Data' section will look like this:

<table>
  <tr>
    <th>Vehicle address</th>
    <th>Function ID</th>
    <th>Function status</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>16 Bit</th>
  </tr>
</table>

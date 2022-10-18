---
id: data-name-extended
title: Data Name Extended
sidebar_position: 7
---

import CommandAndGroup from '@site/src/components/CommandAndGroup';

<CommandAndGroup group="07" command="21"/>

## Receiving

This command is only available on the PC interface (USB/LAN). This allows an app to transfer texts with up to 192 characters in one command. However, some entries are limited to 32 characters, or there are limitations in the GUI display.

:::note

Names and other strings are to be sent 0x00 terminated!

:::

When receiving command _0x21_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Sub ID</th>
    <th>Value 1</th>
    <th>Value 2</th>
    <th>Name</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>32 Bit</th>
    <th>191 Bytes</th>
  </tr>
</table>

The 'NID' indicates for which device the text is valid. If 'NID' is e.g.: the NID of a vehicle, the texts are linked to this vehicle. All other texts can also be transmitted with this command.

### Description table for value 1 / 2

<table>
  <tr>
    <th>NID</th>
    <th>Sub ID</th>
    <th>Value 1</th>
    <th>Value 2</th>
    <th>Usage</th>
    <th>Max length</th>
  </tr>
  <tr>
    <th>Vehicle</th>
    <th>0</th>
    <th>0</th>
    <th>0</th>
    <th>Vehicle name</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th></th>
    <th>1</th>
    <th>0</th>
    <th>0</th>
    <th>Railroad company</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>Accessories</th>
    <th>Port</th>
    <th>0</th>
    <th>0</th>
    <th>Designation for connection</th>
    <th></th>
  </tr>
  <tr>
    <th>0x7F00</th>
    <th>Vendor</th>
    <th>0</th>
    <th>0</th>
    <th>Manufacturer names</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F02</th>
    <th>Decoder</th>
    <th>0</th>
    <th>0</th>
    <th>Decoder name/types</th>
    <th>32 characters GUI <br/>
        MX32 max. space <br/>
        for 8 characters</th>
  </tr>
  <tr>
    <th>0x7F04</th>
    <th>CfgName</th>
    <th>Type
        (8Bit),
        CgfNum
        (24Bit)</th>
    <th>0</th>
    <th>CV Designation</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F06</th>
    <th>Cfg Db</th>
    <th></th>
    <th></th>
    <th>Cfg Db</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F10</th>
    <th>Icon</th>
    <th></th>
    <th></th>
    <th>Icon</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F11</th>
    <th>Icon</th>
    <th></th>
    <th></th>
    <th>Icon</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F18</th>
    <th>ZIMO
        Partner</th>
    <th></th>
    <th></th>
    <th>ZIMO
        Partner</th>
    <th>32 characters</th>
  </tr>
  <tr>
    <th>0x7F20</th>
    <th>Land</th>
    <th></th>
    <th></th>
    <th>Land</th>
    <th>32 characters</th>
  </tr>
</table>

:::tip

Value2 is intended for groups.

:::

## Sending

When sending command _0x21_ the 'Data' section will look like this:

<table>
  <tr>
    <th>NID</th>
    <th>Sub ID</th>
    <th>0</th>
    <th>0</th>
    <th>Name</th>
    <th>0</th>
  </tr>
  <tr>
    <th>16 Bit</th>
    <th>16 Bit</th>
    <th>32 Bit</th>
    <th>32 Bit</th>
    <th>Name length * 8 Bit</th>
    <th>8 Bit</th>
  </tr>
</table>

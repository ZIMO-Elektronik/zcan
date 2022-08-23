---
id: implementation
title: Implementation
sidebar_position: 3
---

1. In principle, all commands are confirmed by 'ACKs', but this confirmation may take some time, depending on the command.
2. A PC software MUST also process 'ACKs' for commands which it did not send itself. The MX10 always sends 'Command Acknowledgements' to all interfaces (physical CAN bus, XPressNet, PC interface).
3. The computer software must be able to process the deviation data in "ACK". The computer software is responsible for this and must display the deviation data accordingly.
4. A PC software must assume that it is not the only command source in the system, i.e: Control panels, possibly other programs or system-internal processes generate commands.
5. The 'ACKs' always represent the MX10 internal state. This can deviate for various reasons from the desired state of a PC software for various reasons.
6. The MX10 is designed for maximum data throughput. Commands with up to 1MBaud can be sent from the PC via the USB interface. PC can be sent. This corresponds to about 5000 to 15,000 commands per second (depending on the transmitted data bytes).
7. All commands (CMDs) are immediately mapped by MX10 into the respective object (vehicle, switch, MX8, MX9, ...).
8. Each object has its own asynchronously running state engine, which implements the desired target state.
9. The object state engines process the commands with the respective possible speed. DCC commands need about 20mS until they reach a vehicle decoder for the first time. Commands to MX8 or MX9 modules in average only about 5mS.
10. This means that MX8/MX9 commands can e.g.: Rail commands (vehicles, switches) can 'overtake'. The PC must therefore assume that it can receive an ACK for commands sent 'later'.
11. Particular attention must be paid to the following in the case of vehicle commands: _If speed changes and function commands are sent to the same vehicle, the speed commands have priority over the function commands and are therefore processed first and also acknowledged._
12. If speed commands are sent continuously over the interface, in a faster order than they can be sent to the track, then the 'most current' speed is always sent to the track. Intermediate jumps are ignored and thus skipped.
13. The computer software must also assume that function commands are sent to the vehicle with a significant delay if the vehicle is simultaneously 'overloaded' with speed commands. In the worst case (because speed commands are present) only every 32nd command is used to send functions (so it may take 640 mS), for a full update of all functions (28) this means about 1.5 seconds!
14. As noted above, each command is usually acknowledged by 'its' ACK, i.e., in essence, the corresponding command is 1:1 as an ACK with the corresponding 'ACTUAL' data. However, in some cases it is not possible. In the DCC format, functions are transferred to the vehicle in groups. Therefore ACK is also sent as a 'collective' ACK, which contains the status of all 32 functions.
15. An application must send a message to the MX10 at least every 60 seconds, otherwise the connection is 'terminated' by the MX10. This is a protection for applications, which e.g.: 'crash', or leave the W-LAN range.

## Optimal implementation for pc software

For a PC software to use the possible interface throughput, it should implement the following:

1. All commands sent by you should be stored in a list by the PC software (ring buffer).
2. Commands which only change data (e.g.: speed) should not be entered in this list, but overwrite the already existing command.
3. All "ACKs" from MX10 should be deleted from the list as 'done'.
4. At the same time, it should be checked whether the 'confirmed' data (e.g.: speed) deviates from the own set-point.
5. in case of deviation the software SHALL react sensibly, e.g. by sending:

- Own set-point,
- User Info,
- Automatic adjustment of interlocking,
- Speeds of other vehicles ... etc.

6. ACKs which are not present in the list, i.e. which were not sent by the PC software, must be processed sensibly. In particular, 'ALL OFF', 'ALL STOP' must be observed here. But of course also travel commands and switching commands to vehicles.
7. Depending on the type of command, PC software may assume that the ACK's require 500mS to 2000mS. Especially Rail commands can have considerable delays. If the PC software does NOT receive an ACK within this worst-case period, it must assume that an error has occurred.

export var MsgMode;
(function (MsgMode) {
    MsgMode[MsgMode["REQ"] = 0] = "REQ";
    MsgMode[MsgMode["CMD"] = 1] = "CMD";
    MsgMode[MsgMode["EVT"] = 2] = "EVT";
    MsgMode[MsgMode["ACK"] = 3] = "ACK";
})(MsgMode || (MsgMode = {}));
export var OpMode;
(function (OpMode) {
    OpMode[OpMode["NONE"] = 0] = "NONE";
    OpMode[OpMode["DCC"] = 1] = "DCC";
    OpMode[OpMode["MM2"] = 2] = "MM2";
    OpMode[OpMode["UNDEF"] = 3] = "UNDEF";
    OpMode[OpMode["MFX"] = 4] = "MFX";
    OpMode[OpMode["SYS"] = 7] = "SYS";
})(OpMode || (OpMode = {}));
export var StepMax;
(function (StepMax) {
    StepMax[StepMax["UNKNOWN"] = 0] = "UNKNOWN";
    StepMax[StepMax["MAX14"] = 1] = "MAX14";
    StepMax[StepMax["MAX27"] = 2] = "MAX27";
    StepMax[StepMax["MAX28"] = 3] = "MAX28";
    StepMax[StepMax["MAX128"] = 4] = "MAX128";
    StepMax[StepMax["MAX1024"] = 5] = "MAX1024";
})(StepMax || (StepMax = {}));
export var ExternalController;
(function (ExternalController) {
    ExternalController["FS"] = "FS";
    ExternalController["T1"] = "T1";
    ExternalController["T2"] = "T2";
    ExternalController["FT"] = "FT";
    ExternalController["FT2"] = "FT(2)";
    ExternalController["FS2"] = "FS(2)";
})(ExternalController || (ExternalController = {}));
export var FunctionMode;
(function (FunctionMode) {
    FunctionMode[FunctionMode["switch"] = 0] = "switch";
    FunctionMode[FunctionMode["moment"] = 16384] = "moment";
})(FunctionMode || (FunctionMode = {}));
export var SystemStateMode;
(function (SystemStateMode) {
    SystemStateMode[SystemStateMode["NORMAL"] = 1] = "NORMAL";
    SystemStateMode[SystemStateMode["SSP0"] = 2] = "SSP0";
    SystemStateMode[SystemStateMode["SSPe"] = 3] = "SSPe";
    SystemStateMode[SystemStateMode["OFF"] = 4] = "OFF";
    SystemStateMode[SystemStateMode["SERVICE"] = 5] = "SERVICE";
    SystemStateMode[SystemStateMode["OVERRCURRENT"] = 10] = "OVERRCURRENT";
})(SystemStateMode || (SystemStateMode = {}));
export var TrackMode;
(function (TrackMode) {
    TrackMode[TrackMode["OFF"] = -1] = "OFF";
    TrackMode[TrackMode["NORMAL"] = 0] = "NORMAL";
    TrackMode[TrackMode["SSP0"] = 1] = "SSP0";
    TrackMode[TrackMode["SSPe"] = 2] = "SSPe";
    TrackMode[TrackMode["SMP"] = 4] = "SMP";
    TrackMode[TrackMode["UPDATE"] = 5] = "UPDATE";
    TrackMode[TrackMode["SOUND"] = 6] = "SOUND";
    TrackMode[TrackMode["ERROR"] = 8] = "ERROR";
    TrackMode[TrackMode["ERROR_SMP"] = 9] = "ERROR_SMP";
})(TrackMode || (TrackMode = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["UNDEFINED"] = 0] = "UNDEFINED";
    Direction[Direction["EAST"] = 1] = "EAST";
    Direction[Direction["WEST"] = 2] = "WEST";
})(Direction || (Direction = {}));
export var NameType;
(function (NameType) {
    NameType[NameType["VEHICLE"] = 0] = "VEHICLE";
    NameType[NameType["RAILWAY"] = 1] = "RAILWAY";
    NameType[NameType["CONNECTION"] = 2] = "CONNECTION";
    NameType[NameType["MANUFACTURER"] = 3] = "MANUFACTURER";
    NameType[NameType["DECODER"] = 4] = "DECODER";
    NameType[NameType["DESIGNATION"] = 5] = "DESIGNATION";
    NameType[NameType["CFGDB"] = 6] = "CFGDB";
    NameType[NameType["ICON"] = 7] = "ICON";
    NameType[NameType["ZIMO_PARTNER"] = 8] = "ZIMO_PARTNER";
    NameType[NameType["LAND"] = 9] = "LAND";
    NameType[NameType["COMPANY_CV"] = 10] = "COMPANY_CV";
})(NameType || (NameType = {}));
export var ImageType;
(function (ImageType) {
    ImageType[ImageType["VEHICLE"] = 1] = "VEHICLE";
    ImageType[ImageType["VEHICLE_CRC32"] = 2] = "VEHICLE_CRC32";
    ImageType[ImageType["TACHO"] = 3] = "TACHO";
    ImageType[ImageType["VEHICLE_INSTRUMENT_BRAKE_BAR"] = 10] = "VEHICLE_INSTRUMENT_BRAKE_BAR";
    ImageType[ImageType["VEHICLE_INSTRUMENT"] = 31] = "VEHICLE_INSTRUMENT";
})(ImageType || (ImageType = {}));
export var FxModeType;
(function (FxModeType) {
    FxModeType[FxModeType["TOGGLE"] = 0] = "TOGGLE";
    FxModeType[FxModeType["MOMENT"] = 1] = "MOMENT";
    FxModeType[FxModeType["TIMEOUT"] = 2] = "TIMEOUT";
    FxModeType[FxModeType["EXTENDED"] = 3] = "EXTENDED";
})(FxModeType || (FxModeType = {}));
export var FxConfigType;
(function (FxConfigType) {
    FxConfigType[FxConfigType["REDIRECT_ADDR"] = 1] = "REDIRECT_ADDR";
    FxConfigType[FxConfigType["MODE"] = 2] = "MODE";
    FxConfigType[FxConfigType["FREE"] = 3] = "FREE";
    FxConfigType[FxConfigType["TIME_VALUE_1"] = 4] = "TIME_VALUE_1";
    FxConfigType[FxConfigType["TIME_VALUE_2"] = 5] = "TIME_VALUE_2";
    FxConfigType[FxConfigType["ICON"] = 16] = "ICON";
    FxConfigType[FxConfigType["SOUND"] = 17] = "SOUND";
    FxConfigType[FxConfigType["ANY"] = 32] = "ANY";
})(FxConfigType || (FxConfigType = {}));
export var SpecialFxNr;
(function (SpecialFxNr) {
    SpecialFxNr[SpecialFxNr["MANUAL"] = 1] = "MANUAL";
    SpecialFxNr[SpecialFxNr["SHUNTING"] = 2] = "SHUNTING";
    SpecialFxNr[SpecialFxNr["DIR_DEFAULT"] = 3] = "DIR_DEFAULT";
})(SpecialFxNr || (SpecialFxNr = {}));
export var Manual;
(function (Manual) {
    Manual[Manual["OFF"] = 0] = "OFF";
    Manual[Manual["ON"] = 1] = "ON";
})(Manual || (Manual = {}));
export var Shunting;
(function (Shunting) {
    Shunting[Shunting["OFF"] = 0] = "OFF";
    Shunting[Shunting["AZBZ"] = 1] = "AZBZ";
    Shunting[Shunting["HALF"] = 2] = "HALF";
})(Shunting || (Shunting = {}));
export var BidiType;
(function (BidiType) {
    BidiType[BidiType["RAILCOM_STATISTICS"] = 0] = "RAILCOM_STATISTICS";
    BidiType[BidiType["SPEED_REPORT"] = 256] = "SPEED_REPORT";
    BidiType[BidiType["TILT_AND_CURVE"] = 257] = "TILT_AND_CURVE";
    BidiType[BidiType["CV"] = 512] = "CV";
    BidiType[BidiType["QOS"] = 768] = "QOS";
    BidiType[BidiType["FILL_LEVEL"] = 1024] = "FILL_LEVEL";
    BidiType[BidiType["DIRECTION"] = 2048] = "DIRECTION";
    BidiType[BidiType["TRACK_VOLTAGE"] = 4096] = "TRACK_VOLTAGE";
    BidiType[BidiType["ALARMS"] = 4352] = "ALARMS";
})(BidiType || (BidiType = {}));
export var ForwardOrReverse;
(function (ForwardOrReverse) {
    ForwardOrReverse[ForwardOrReverse["UNKNOWN"] = 0] = "UNKNOWN";
    ForwardOrReverse[ForwardOrReverse["FORWARD"] = 1] = "FORWARD";
    ForwardOrReverse[ForwardOrReverse["REVERSE"] = 2] = "REVERSE";
})(ForwardOrReverse || (ForwardOrReverse = {}));
export var ModInfoType;
(function (ModInfoType) {
    ModInfoType[ModInfoType["HW_VERSION"] = 1] = "HW_VERSION";
    ModInfoType[ModInfoType["SW_VERSION"] = 2] = "SW_VERSION";
    ModInfoType[ModInfoType["SW_BUILD_DATE"] = 3] = "SW_BUILD_DATE";
    ModInfoType[ModInfoType["SW_BUILD_TIME"] = 4] = "SW_BUILD_TIME";
    ModInfoType[ModInfoType["RTC_DATE"] = 5] = "RTC_DATE";
    ModInfoType[ModInfoType["RTC_TIME"] = 6] = "RTC_TIME";
    ModInfoType[ModInfoType["MIWI_HW_VERSION"] = 8] = "MIWI_HW_VERSION";
    ModInfoType[ModInfoType["MIWI_SW_VERSION"] = 9] = "MIWI_SW_VERSION";
    ModInfoType[ModInfoType["MIWI_CHANNEL"] = 10] = "MIWI_CHANNEL";
    ModInfoType[ModInfoType["MOD_NUMBER"] = 20] = "MOD_NUMBER";
    ModInfoType[ModInfoType["STEIN_CFGNUM_SECTIONS"] = 513] = "STEIN_CFGNUM_SECTIONS";
    ModInfoType[ModInfoType["STEIN_CFGNUM_TURNOUTS"] = 514] = "STEIN_CFGNUM_TURNOUTS";
    ModInfoType[ModInfoType["STEIN_CFGNUM_SIGNALS"] = 515] = "STEIN_CFGNUM_SIGNALS";
    ModInfoType[ModInfoType["STEIN_EXTENSION_SLOT1"] = 528] = "STEIN_EXTENSION_SLOT1";
    ModInfoType[ModInfoType["STEIN_EXTENSION_SLOT2"] = 544] = "STEIN_EXTENSION_SLOT2";
})(ModInfoType || (ModInfoType = {}));
export var AccessoryMode;
(function (AccessoryMode) {
    AccessoryMode[AccessoryMode["UNKNOWN"] = 0] = "UNKNOWN";
    AccessoryMode[AccessoryMode["PAIRED"] = 1] = "PAIRED";
    AccessoryMode[AccessoryMode["SINGLE"] = 2] = "SINGLE";
})(AccessoryMode || (AccessoryMode = {}));
export var AccessoryPortState;
(function (AccessoryPortState) {
    AccessoryPortState["ON"] = "on";
    AccessoryPortState["OFF"] = "off";
    AccessoryPortState["UNKNOWN"] = "unknown";
})(AccessoryPortState || (AccessoryPortState = {}));
export var SectionState;
(function (SectionState) {
    SectionState[SectionState["FREE_OFF"] = 0] = "FREE_OFF";
    SectionState[SectionState["FREE_ON"] = 1] = "FREE_ON";
    SectionState[SectionState["OCCUPIED_OFF"] = 16] = "OCCUPIED_OFF";
    SectionState[SectionState["OCCUPIED_ON"] = 17] = "OCCUPIED_ON";
    SectionState[SectionState["OCCUPIED_FAULT"] = 18] = "OCCUPIED_FAULT";
})(SectionState || (SectionState = {}));
export var HluSignal;
(function (HluSignal) {
    HluSignal[HluSignal["OFF"] = 0] = "OFF";
    HluSignal[HluSignal["HALT"] = 2] = "HALT";
    HluSignal[HluSignal["UH"] = 4] = "UH";
    HluSignal[HluSignal["U"] = 6] = "U";
    HluSignal[HluSignal["LU"] = 8] = "LU";
    HluSignal[HluSignal["L"] = 10] = "L";
    HluSignal[HluSignal["FL"] = 12] = "FL";
    HluSignal[HluSignal["FAHRT"] = 14] = "FAHRT";
})(HluSignal || (HluSignal = {}));
//# sourceMappingURL=enums.js.map
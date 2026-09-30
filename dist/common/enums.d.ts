export declare enum MsgMode {
    REQ = 0,
    CMD = 1,
    EVT = 2,
    ACK = 3
}
export declare enum OpMode {
    NONE = 0,
    DCC = 1,
    MM2 = 2,
    UNDEF = 3,
    MFX = 4,
    SYS = 7
}
export declare enum StepMax {
    UNKNOWN = 0,
    MAX14 = 1,
    MAX27 = 2,
    MAX28 = 3,
    MAX128 = 4,
    MAX1024 = 5
}
export declare enum ExternalController {
    FS = "FS",
    T1 = "T1",
    T2 = "T2",
    FT = "FT",
    FT2 = "FT(2)",
    FS2 = "FS(2)"
}
export declare enum FunctionMode {
    switch = 0,
    moment = 16384
}
export declare enum SystemStateMode {
    NORMAL = 1,
    SSP0 = 2,
    SSPe = 3,
    OFF = 4,
    SERVICE = 5,
    OVERRCURRENT = 10
}
export declare enum TrackMode {
    OFF = -1,
    NORMAL = 0,
    SSP0 = 1,
    SSPe = 2,
    SMP = 4,
    UPDATE = 5,
    SOUND = 6,
    ERROR = 8,
    ERROR_SMP = 9
}
export declare enum Direction {
    UNDEFINED = 0,
    EAST = 1,
    WEST = 2
}
export declare enum NameType {
    VEHICLE = 0,
    RAILWAY = 1,
    CONNECTION = 2,
    MANUFACTURER = 3,
    DECODER = 4,
    DESIGNATION = 5,
    CFGDB = 6,
    ICON = 7,
    ZIMO_PARTNER = 8,
    LAND = 9,
    COMPANY_CV = 10
}
export declare enum ImageType {
    VEHICLE = 1,
    VEHICLE_CRC32 = 2,
    TACHO = 3,
    VEHICLE_INSTRUMENT_BRAKE_BAR = 10,
    VEHICLE_INSTRUMENT = 31
}
export declare enum FxModeType {
    TOGGLE = 0,
    MOMENT = 1,
    TIMEOUT = 2,
    EXTENDED = 3
}
export declare enum FxConfigType {
    REDIRECT_ADDR = 1,
    MODE = 2,
    FREE = 3,
    TIME_VALUE_1 = 4,
    TIME_VALUE_2 = 5,
    ICON = 16,
    SOUND = 17,
    ANY = 32
}
export declare enum SpecialFxNr {
    MANUAL = 1,
    SHUNTING = 2,
    DIR_DEFAULT = 3
}
export declare enum Manual {
    OFF = 0,
    ON = 1
}
export declare enum Shunting {
    OFF = 0,
    AZBZ = 1,
    HALF = 2
}
export declare enum BidiType {
    RAILCOM_STATISTICS = 0,
    SPEED_REPORT = 256,
    TILT_AND_CURVE = 257,
    CV = 512,
    QOS = 768,
    FILL_LEVEL = 1024,
    DIRECTION = 2048,
    TRACK_VOLTAGE = 4096,
    ALARMS = 4352
}
export declare enum ForwardOrReverse {
    UNKNOWN = 0,
    FORWARD = 1,
    REVERSE = 2
}
export declare enum ModInfoType {
    HW_VERSION = 1,
    SW_VERSION = 2,
    SW_BUILD_DATE = 3,
    SW_BUILD_TIME = 4,
    RTC_DATE = 5,
    RTC_TIME = 6,
    MIWI_HW_VERSION = 8,
    MIWI_SW_VERSION = 9,
    MIWI_CHANNEL = 10,
    MOD_NUMBER = 20,
    STEIN_CFGNUM_SECTIONS = 513,
    STEIN_CFGNUM_TURNOUTS = 514,
    STEIN_CFGNUM_SIGNALS = 515,
    STEIN_EXTENSION_SLOT1 = 528,
    STEIN_EXTENSION_SLOT2 = 544
}
export declare enum AccessoryMode {
    UNKNOWN = 0,
    PAIRED = 1,
    SINGLE = 2
}
export declare enum AccessoryPortState {
    ON = "on",
    OFF = "off",
    UNKNOWN = "unknown"
}
export declare enum SectionState {
    FREE_OFF = 0,
    FREE_ON = 1,
    OCCUPIED_OFF = 16,
    OCCUPIED_ON = 17,
    OCCUPIED_FAULT = 18
}
export declare enum HluSignal {
    OFF = 0,
    HALT = 2,
    UH = 4,
    U = 6,
    LU = 8,
    L = 10,
    FL = 12,
    FAHRT = 14
}

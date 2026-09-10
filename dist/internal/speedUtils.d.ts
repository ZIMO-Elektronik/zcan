import { Direction } from "../util/enums";
export declare const combineSpeedAndDirection: (speed: number, forward: boolean, eastWest?: Direction, emergencyStop?: boolean) => number;
export declare const parseSpeed: (speedAndDirection: number) => {
    speedStep: number;
    forward: boolean;
    eastWest: number;
    emergencyStop: boolean;
};
export declare const getSpeedSteps: (val: number) => number | undefined;

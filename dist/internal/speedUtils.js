import { Direction } from "../util/enums";
import { directACKBites, directionBites, eastWestBites_, emergencyStopB, speedBites____, speedStepBites } from "./bites";
export const combineSpeedAndDirection = (speed, forward, eastWest = Direction.UNDEFINED, emergencyStop = false) => {
    const direction = Number(!forward);
    const stop = Number(emergencyStop);
    return speed | (direction << 10) | (eastWest << 12) | (stop << 15);
};
export const parseSpeed = (speedAndDirection) => {
    const speedStep = speedAndDirection & speedBites____;
    const direction = (speedAndDirection & directionBites) === directionBites;
    const directionACK = (speedAndDirection & directACKBites) === directACKBites;
    const sideways = (speedAndDirection & eastWestBites_) >> 12;
    const emergencyStop = (speedAndDirection & emergencyStopB) === emergencyStopB;
    const forward = !direction && !directionACK;
    return {
        speedStep,
        forward,
        eastWest: sideways,
        emergencyStop
    };
};
export const getSpeedSteps = (val) => {
    const steps = val & speedStepBites;
    if (steps == 0 || steps >= 6) {
        return undefined;
    }
    return steps;
};
//# sourceMappingURL=speedUtils.js.map
const speedBites____ = 0b0000001111111111; // 0-9
const directionBites = 0b0000010000000000; // 10
const directACKBites = 0b0000100000000000; // 11
const eastWestBites_ = 0b0011000000000000; // 12-13
const emergencyStopB = 0b1000000000000000; // 15

export const combineSpeedAndDirection = (speed: number, forward: boolean, eastWest?: boolean, emergencyStop = false) => {
  const direction = Number(forward);
  const sideways = eastWest === undefined ? 0 : eastWest ? 1 : 2;
  const stop = Number(emergencyStop);

  return speed | (direction << 10) | (sideways << 12) | (stop << 15);
};

export const parseSpeed = (speedAndDirection: number) => {
  const speedStep = speedAndDirection & speedBites____;
  const direction = (speedAndDirection & directionBites) === directionBites;
  const directionACK = (speedAndDirection & directACKBites) === directACKBites;
  const sideways = speedAndDirection & eastWestBites_;
  const eStop = speedAndDirection & emergencyStopB;

  const forward = direction || directionACK;
  const eastWest = sideways === 1 ? true : sideways === 2 ? false : undefined;
  const emergencyStop = eStop === 1;

  return {
    speedStep,
    forward,
    eastWest,
    emergencyStop
  };
}

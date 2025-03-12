export function AnimationTimer() {
  const fps: number = 60 / 1000;
  let speedFactor: number = -1;
  let lastTimestamp: DOMHighResTimeStamp = -1;

  function setTimestamp(timestamp: number) {
    const timeDifference = timestamp - lastTimestamp;
    speedFactor = timeDifference * fps;
    lastTimestamp = timestamp;
  }

  function getSpeedFactor(): DOMHighResTimeStamp {
    return speedFactor;
  }

  return {
    setTimestamp,
    getSpeedFactor,
  };
}

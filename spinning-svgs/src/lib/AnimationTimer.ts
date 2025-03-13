export function AnimationTimer() {
  const fps = 60 / 1000;
  let speedFactor = -1;
  let lastTimestamp = -1;
  let lastFrame = 0; // my own, independant frame counter that I can reset

  function setTimestamp(timestamp: number) {
    const timeDifference = timestamp - lastTimestamp;
    speedFactor = timeDifference * fps;
    lastTimestamp = timestamp;
    lastFrame = Number((lastFrame + 0.25).toFixed(1));
  }

  function getFrame() {
    return { frame: lastFrame, speedFactor };
  }

  function setFrame(frame: number) {
    lastFrame = frame;
  }

  function getSpeedFactor(): number {
    return speedFactor;
  }

  return {
    setTimestamp,
    getFrame,
    setFrame,
    getSpeedFactor,
  };
}

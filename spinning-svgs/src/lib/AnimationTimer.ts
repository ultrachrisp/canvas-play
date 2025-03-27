/**
 * A utility function to manage animation timing by tracking the frame number
 * and speed factor.
 *
 * The frame number is an incrementing value that can be reset, while the speed
 * factor determines how quickly the animation progresses. The speed factor is
 * calculated based on the time difference between the current and previous
 * timestamps, scaled to a constant frame rate (60fps).
 *
 * @returns An object with methods to control and retrieve animation timing:
 * - `setTimestamp(timestamp: number)`: Updates the current timestamp, frame
 *   number, and speed factor.
 * - `getFrame()`: Retrieves the current frame number and speed factor.
 * - `setFrame(frame: number)`: Resets the frame number to a specific value.
 * - `getSpeedFactor(): number`: Retrieves the current speed factor.
 */
export function AnimationTimer() {
  const fps = (hasTouchSupport() ? 120 : 60) / 1000; // setting fps based off of bad mobile device detection
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

function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

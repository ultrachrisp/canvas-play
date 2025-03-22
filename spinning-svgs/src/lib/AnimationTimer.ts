/**
 * AnimationTimer is a utility function that keeps track of an animation's
 * frame number and speed factor.
 *
 * The frame number is an incrementing number that can be reset, and the speed
 * factor is a value that represents how quickly the animation should be
 * progressing. The speed factor is calculated by multiplying the difference
 * between the current and last timestamps by a constant frame rate (60fps).
 *
 * @returns An object with the following methods:
 *   - `setTimestamp(timestamp: number)`: Set the current timestamp and update
 *     the frame number and speed factor.
 *   - `getFrame()`: Get the current frame number and speed factor.
 *   - `setFrame(frame: number)`: Set the current frame number.
 *   - `getSpeedFactor(): number`: Get the current speed factor.
 */
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

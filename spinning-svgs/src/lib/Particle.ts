interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  numOfColours: number;
}

export type AnimationState = "spin" | "fadeIn" | "hover" | "wave";

export type ParticleType = {
  hover: () => void;
  update: (params: { frame: number; speedFactor: number }) => void;
  draw: (
    params: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) => void;
  setParticleState: (newState: AnimationState) => void;
  getParticleState: () => AnimationState;
  getArrayPosition: () => { arrayPositionX: number; arrayPositionY: number };
  setDistanceToTarget: (distance: number, newState: AnimationState) => void;
};

export function Particle({
  width,
  height,
  arrayPositionX,
  arrayPositionY,
  numOfColours,
}: Particle): ParticleType {
  let variableWidth = 1;
  let variableCenter = variableWidth / 2;

  let angle = 0;
  let radians = 0;
  const radiansConversion = Math.PI / 180;
  const translateX = (arrayPositionX * width) + (width / 2);
  const translateY = (arrayPositionY * height) + (height / 2);

  let colour = 0;
  let changeColour = false;
  let enlarge = true;
  let state: AnimationState = "fadeIn";
  let delay = 0;
  let distanceFromTarget = 0;
  const fadeInStartWeight = arrayPositionX + arrayPositionY;

  function fadeIn(frame: number) {
    if (fadeInStartWeight < frame) {
      variableWidth *= 1.05;
      variableCenter = variableWidth / 2;
      if (variableWidth >= width) {
        variableWidth = width;
        enlarge = false;
        state = "spin";
      }
    }
  }

  function hover() {
    if (enlarge) {
      variableWidth *= 1.05;
      colour = getHoverColour();

      if (variableWidth >= width) {
        variableWidth = width;
        enlarge = false;
        state = "spin";
      }
    } else {
      variableWidth *= 0.95;
      if (variableWidth < 15) {
        enlarge = true;
        changeColour = true;
      }
    }

    variableCenter = variableWidth / 2;
  }

  function wave(frame: number) {
    if (delay === 0) delay = frame;

    if ((distanceFromTarget + delay) <= frame) {
      if (enlarge) {
        variableWidth *= 1.05;
        colour = 0;

        if (variableWidth >= width) {
          variableWidth = width;
          enlarge = false;
          state = "spin";
          delay = 0;
        }
      } else {
        variableWidth *= 0.95;
        if (variableWidth < 15) {
          enlarge = true;
          changeColour = true;
        }
      }

      variableCenter = variableWidth / 2;
    }
  }

  function getHoverColour() {
    if (!changeColour) return colour;
    changeColour = false;

    return (colour >= numOfColours - 1) ? 0 : ++colour;
  }

  function update(
    { frame, speedFactor }: { frame: number; speedFactor: number },
  ) {
    angle = (angle > 360) ? 0 : angle + speedFactor;
    radians = angle * radiansConversion;

    switch (state) {
      case "fadeIn":
        fadeIn(frame);
        break;
      case "hover":
        hover();
        break;
      case "wave":
        wave(frame);
        break;
      case "spin":
      default:
        state = "spin";
    }
  }

  function draw(
    { context, spriteSheet }: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) {
    context.save();
    context.translate(translateX, translateY);
    context.rotate(radians);
    context.drawImage(
      spriteSheet,
      colour * width,
      0,
      width,
      height,
      -variableCenter,
      -variableCenter,
      variableWidth,
      variableWidth,
    );
    context.restore();
  }

  function setParticleState(newState: AnimationState) {
    state = newState;
  }

  function getParticleState() {
    return state;
  }

  function getArrayPosition() {
    return { arrayPositionX, arrayPositionY };
  }

  function setDistanceToTarget(distance: number, newState: AnimationState) {
    distanceFromTarget = distance;
    state = newState;
  }

  return {
    hover,
    update,
    draw,
    setParticleState,
    getParticleState,
    getArrayPosition,
    setDistanceToTarget,
  };
}

interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  numOfColours: number;
}

export type AnimationState = "spin" | "fadeOut" | "fadeIn" | "hover";

export type ParticleType = {
  hover: () => void;
  update: (params: { speedFactor: DOMHighResTimeStamp }) => void;
  draw: (
    params: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) => void;
  setParticleState: (newState: AnimationState) => void;
};

export function Particle({
  width,
  height,
  arrayPositionX,
  arrayPositionY,
  numOfColours,
}: Particle): ParticleType {
  let variableWidth = width;
  let variableCenter = width / 2;

  let angle = 0;
  let radians = 0;
  const radiansConversion = Math.PI / 180;
  const translateX = (arrayPositionX * width) + (width / 2);
  const translateY = (arrayPositionY * height) + (height / 2);

  let colour = 0;
  let changeColour = false;
  let enlarge = false;
  let state: AnimationState = "spin";

  function fadeIn() {}

  function fadeOut() {}

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

  function getHoverColour() {
    if (!changeColour) return colour;
    changeColour = false;

    return (colour >= numOfColours - 1) ? 0 : ++colour;
  }

  function update({ speedFactor }: { speedFactor: DOMHighResTimeStamp }) {
    angle = (angle > 360) ? 0 : angle + speedFactor;
    radians = angle * radiansConversion;

    switch (state) {
      case "fadeIn":
        fadeIn();
        break;
      case "fadeOut":
        fadeOut();
        break;
      case "hover":
        hover();
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

  return { hover, update, draw, setParticleState };
}

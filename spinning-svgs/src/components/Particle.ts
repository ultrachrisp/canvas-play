import { AnimationTimer } from "./AnimationTimer";

interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  CanvasContext: CanvasRenderingContext2D;
  offScreenCanvas: HTMLCanvasElement;
}

type AnimationState = "spin" | "fadeOut" | "fadeIn";

export class ParticleHelper {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  centerX: number;
  centerY: number;
  translateX: number;
  translateY: number;
  angle: number;
  radians: number;
  colour: number;
  canvasContext: CanvasRenderingContext2D;
  offScreenCanvas: HTMLCanvasElement;
  state: AnimationState;
  animationTimer: AnimationTimer;

  constructor(
    {
      width,
      height,
      arrayPositionX,
      arrayPositionY,
      CanvasContext,
      offScreenCanvas,
    }: Particle,
  ) {
    this.width = width;
    this.height = height;
    this.arrayPositionX = arrayPositionX;
    this.arrayPositionY = arrayPositionY;

    this.angle = 0;
    this.radians = 0;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.translateX = (this.arrayPositionX * this.width) + this.centerX;
    this.translateY = (this.arrayPositionY * this.height) + this.centerY;

    this.canvasContext = CanvasContext;
    this.offScreenCanvas = offScreenCanvas;
    // temp, to check spritesheet is workingn
    this.colour = randomIntFromInterval(0, 5);
    this.state = "spin";
    this.animationTimer = AnimationTimer.getInstance();
  }

  init() {}

  fadeIn() {}

  fadeOut() {}

  update() {
    this.angle = (this.angle > 360)
      ? 0
      : this.angle + this.animationTimer.getSpeedFactor();
    this.radians = this.angle * (Math.PI / 180);

    // switch (this.state) {
    //   case "fadeIn":
    //     this.fadeIn();
    //     break;
    //   case "fadeOut":
    //     this.fadeOut();
    //     break;
    // }
  }

  draw() {
    this.canvasContext.save();
    this.canvasContext.translate(this.translateX, this.translateY);
    this.canvasContext.rotate(this.radians);
    this.canvasContext.drawImage(
      this.offScreenCanvas,
      this.colour * this.width,
      0,
      this.width,
      this.height,
      -this.centerX,
      -this.centerY,
      this.width,
      this.height,
    );
    this.canvasContext.restore();
  }
}

// temp, to check spritesheet is working
function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

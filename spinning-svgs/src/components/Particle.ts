import { getAnimationTimerInstance } from "./AnimationTimer";

interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  numOfColours: number;
}

export type AnimationState = "spin" | "fadeOut" | "fadeIn" | "hover";

const timer = getAnimationTimerInstance();

export class ParticleHelper {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;

  variableWidth: number;
  variableCenter: number;

  angle: number;
  radians: number;
  centerX: number;
  centerY: number;
  translateX: number;
  translateY: number;

  colour: number;
  numOfColours: number;
  colourChange: boolean;
  bigger: boolean;
  state: AnimationState;

  constructor(
    {
      width,
      height,
      arrayPositionX,
      arrayPositionY,
      numOfColours,
    }: Particle,
  ) {
    this.width = width;
    this.height = height;
    this.arrayPositionX = arrayPositionX;
    this.arrayPositionY = arrayPositionY;

    this.variableWidth = width;
    this.variableCenter = this.width / 2;

    this.angle = 0;
    this.radians = 0;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.translateX = (this.arrayPositionX * this.width) + this.centerX;
    this.translateY = (this.arrayPositionY * this.width) + this.centerY;

    // temp, to check spritesheet is workingn
    this.colour = 0; //randomIntFromInterval(0, 5);
    this.numOfColours = numOfColours;
    this.colourChange = false;
    this.bigger = false;
    this.state = "spin";
  }

  init() {}

  fadeIn() {}

  fadeOut() {}

  hover() {
    if (!this.bigger) {
      this.variableWidth = this.variableWidth * 0.95;
      if (this.variableWidth < 20) {
        this.bigger = true;
        this.colourChange = true;
      }
    } else if (this.bigger) {
      this.variableWidth = this.variableWidth * 1.05;
      this.colour = this.getHoverColour();

      if (this.variableWidth >= this.width) {
        this.variableWidth = this.width;
        this.bigger = false;
        this.state = "spin";
      }
    }

    this.variableCenter = this.variableWidth / 2;
    // this.variableHeight = this.variable / 2;
  }

  getHoverColour() {
    if (!this.colourChange) return this.colour;
    this.colourChange = false;

    return ((this.colour + 1) >= this.numOfColours) ? 0 : (this.colour + 1);
  }

  update() {
    this.angle = (this.angle > 360) ? 0 : this.angle + timer.getSpeedFactor();
    this.radians = this.angle * (Math.PI / 180);

    switch (this.state) {
      case "fadeIn":
        this.fadeIn();
        break;
      case "fadeOut":
        this.fadeOut();
        break;
      case "hover":
        this.hover();
        break;
      case "spin":
      default:
        this.state = "spin";
    }
  }

  draw(
    { context, spriteSheet }: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) {
    context.save();
    context.translate(this.translateX, this.translateY);
    context.rotate(this.radians);
    context.drawImage(
      spriteSheet,
      this.colour * this.width,
      0,
      this.width,
      this.height,
      -this.variableCenter,
      -this.variableCenter,
      this.variableWidth,
      this.variableWidth,
    );
    context.restore();
  }
}

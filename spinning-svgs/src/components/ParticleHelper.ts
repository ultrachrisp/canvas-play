interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  CanvasContext: CanvasRenderingContext2D;
  offScreenCanvas: HTMLCanvasElement;
}

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
  }

  init() {}

  update() {
    this.angle = (this.angle > 360) ? 0 : this.angle + 0.5;
    this.radians = this.angle * (Math.PI / 180);
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
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

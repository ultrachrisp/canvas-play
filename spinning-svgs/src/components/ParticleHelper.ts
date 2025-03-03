interface Particle {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  CanvasContext: CanvasRenderingContext2D;
}

export class ParticleHelper {
  width: number;
  height: number;
  arrayPositionX: number;
  arrayPositionY: number;
  centerX: number;
  centerY: number
  angle: number;
  radians: number;
  canvasContext: CanvasRenderingContext2D;

  constructor({ width, height, arrayPositionX, arrayPositionY, CanvasContext }: Particle) {
    this.width = width;
    this.height = height;
    this.arrayPositionX = arrayPositionX;
    this.arrayPositionY = arrayPositionY;
    this.canvasContext = CanvasContext;

    this.angle = 0;
    this.radians = 0;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  init() {

  }

  update() {
    const rotation = (this.angle > 360) ? 0 : this.angle + 0.1;
    this.radians = rotation * Math.PI / 180;
  }

  draw() {
    this.canvasContext.save();
    this.canvasContext.translate(this.arrayPositionX + this.centerX, this.arrayPositionY + this.centerY);
    this.canvasContext.rotate(this.radians);
    this.
  }
}



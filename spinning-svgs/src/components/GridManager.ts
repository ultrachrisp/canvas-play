import { GeneralSettings } from "../types";
import { CanvasHelper } from "./CanvasHelper";
import { ParticleHelper } from "./Particle";

interface GridParams {
  canvasWidth: number;
  canvasHeight: number;
  particleWidth: number;
  particleHeight: number;
}

// type SelectedParticle = {
//   positionX: number;
//   positionY: number
// }

type MatrixGrid = Array<Array<number | ParticleHelper>>;

export class GridHelper {
  grid: MatrixGrid;
  settings: GeneralSettings;
  canvasHelper: CanvasHelper;
  particles: Array<ParticleHelper>;
  spriteCanvas: HTMLCanvasElement;
  currentTime: number;

  constructor(
    canvasHelper: CanvasHelper,
    settings: GeneralSettings,
  ) {
    this.settings = settings;
    this.canvasHelper = canvasHelper;

    this.grid = setGrid({
      canvasWidth: this.canvasHelper.canvas.width,
      canvasHeight: this.canvasHelper.canvas.height,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });

    this.particles = [];
    this.spriteCanvas = this.loadSvg(this.settings, this.canvasHelper);
    this.currentTime = -1;
  }

  init() {
    this.populateGrid();

    this.canvasHelper.canvas.addEventListener("click", (evt) => {
      const [mouseX, mouseY] = getMouseCoordinates(evt, this.canvasHelper);
      const clickedParticle = findParticle(
        mouseX,
        mouseY,
        this.grid,
        this.settings.svgWidth,
      );
      clickedParticle.state = "fadeOut";
    }, false);
  }

  populateGrid() {
    this.grid.forEach((row, x) => {
      row.forEach((_, y) => {
        const particle = new ParticleHelper({
          width: this.settings.svgWidth,
          height: this.settings.svgWidth,
          arrayPositionX: x,
          arrayPositionY: y,
          CanvasContext: this.canvasHelper.context,
          offScreenCanvas: this.canvasHelper.offScreenSpriteCanvas,
        });

        // unsure that I need both
        this.particles.push(particle);
        this.grid[x][y] = particle;
      });
    });
  }

  loadSvg(settings: GeneralSettings, canvasHelper: CanvasHelper) {
    const { svg, svgQuery, colours } = settings;

    let i = this.settings.colours.length;
    while (i--) {
      const result = svg.replace(svgQuery, colours[i]);
      const uri = encodeURIComponent(result);
      const img = new Image();
      const xOffset = i * settings.svgWidth;

      img.onload = () => {
        canvasHelper.offScreenSpriteContext.drawImage(
          img,
          xOffset,
          0,
          settings.svgWidth,
          settings.svgWidth,
        );
      };
      img.src = `data:image/svg+xml,${uri}`;
    }

    return canvasHelper.offScreenSpriteCanvas;
  }

  resize() {
    clearCanvas(this.canvasHelper);
    this.grid = [];
    this.particles = [];

    this.grid = setGrid({
      canvasWidth: this.canvasHelper.canvas.width,
      canvasHeight: this.canvasHelper.canvas.height,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });
    this.populateGrid();
  }

  update() {
    let i = this.particles.length;
    while (i--) {
      this.particles[i].update();
    }
  }

  draw() {
    clearCanvas(this.canvasHelper);

    let i = this.particles.length;
    while (i--) {
      this.particles[i].draw();
    }
  }
}

function getMouseCoordinates(evt: MouseEvent, canvasHelper: CanvasHelper) {
  const boundingRect = canvasHelper.canvas.getBoundingClientRect();
  const mouseX = evt.clientX - boundingRect.left;
  const mouseY = evt.clientY - boundingRect.top;
  return [mouseX, mouseY];
}

function findParticle(
  mouseX: number,
  mouseY: number,
  grid: MatrixGrid,
  svgWidth: number,
): ParticleHelper {
  const x = Math.floor(mouseX / svgWidth);
  const y = Math.floor(mouseY / svgWidth);

  // NOTE! Come back to this
  return grid[x][y] as ParticleHelper;
}

function clearCanvas(canvasHelper: CanvasHelper) {
  return canvasHelper.context.clearRect(
    0,
    0,
    canvasHelper.canvas.width,
    canvasHelper.canvas.height,
  );
}

function setGrid(
  { canvasWidth, canvasHeight, particleWidth, particleHeight }: GridParams,
): Array<Array<number>> {
  const rows = Math.floor(canvasHeight / particleHeight);
  const coloumns = Math.floor(canvasWidth / particleWidth);

  return (new Array(coloumns).fill(0).map(() => new Array(rows).fill(0)));
}

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

type MatrixGrid = Array<Array<ParticleHelper>>;

export class GridHelper {
  grid: MatrixGrid;
  gridRows: number;
  gridColumns: number;
  settings: GeneralSettings;
  canvasHelper: CanvasHelper;
  spriteCanvas: HTMLCanvasElement;

  constructor(
    canvasHelper: CanvasHelper,
    settings: GeneralSettings,
  ) {
    this.settings = settings;
    this.canvasHelper = canvasHelper;

    const [rows, columns] = calculateGrid({
      canvasWidth: this.canvasHelper.canvas.width,
      canvasHeight: this.canvasHelper.canvas.height,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });

    this.gridRows = rows;
    this.gridColumns = columns;

    this.grid = populateGrid(rows, columns, this.settings, this.canvasHelper);

    this.spriteCanvas = this.loadSvg(this.settings, this.canvasHelper);
  }

  init() {
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

    const [rows, columns] = calculateGrid({
      canvasWidth: this.canvasHelper.canvas.width,
      canvasHeight: this.canvasHelper.canvas.height,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });
    this.gridRows = rows;
    this.gridColumns = columns;

    this.grid = populateGrid(rows, columns, this.settings, this.canvasHelper);
  }

  update() {
    let i = this.gridRows;
    let j = this.gridColumns;
    while (i--) {
      if (j < 0) j = this.gridColumns;
      while (j--) {
        this.grid[i][j].update();
      }
    }
  }

  draw() {
    clearCanvas(this.canvasHelper);

    let i = this.gridRows;
    let j = this.gridColumns;
    while (i--) {
      if (j < 0) j = this.gridColumns;
      while (j--) {
        this.grid[i][j].draw();
      }
    }
  }
}

function populateGrid(
  rows: number,
  columns: number,
  settings: GeneralSettings,
  canvasHelper: CanvasHelper,
) {
  let grid = new Array(rows);

  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      const particle = new ParticleHelper({
        width: settings.svgWidth,
        height: settings.svgWidth,
        arrayPositionX: i,
        arrayPositionY: j,
        CanvasContext: canvasHelper.context,
        offScreenCanvas: canvasHelper.offScreenSpriteCanvas,
      });
      grid[i][j] = particle;
    }
  }

  return grid;
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

  return grid[x][y];
}

function clearCanvas(canvasHelper: CanvasHelper) {
  return canvasHelper.context.clearRect(
    0,
    0,
    canvasHelper.canvas.width,
    canvasHelper.canvas.height,
  );
}

function calculateGrid(
  { canvasWidth, canvasHeight, particleWidth, particleHeight }: GridParams,
) {
  const rows = Math.floor(canvasWidth / particleWidth);
  const columns = Math.floor(canvasHeight / particleHeight);

  return [rows, columns];
}

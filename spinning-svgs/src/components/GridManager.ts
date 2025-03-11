import { GeneralSettings } from "../types";
import { CanvasHelper, clearCanvas } from "./CanvasHelper";
import { AnimationState, ParticleHelper } from "./Particle";

interface GridParams {
  canvasWidth: number;
  canvasHeight: number;
  particleWidth: number;
  particleHeight: number;
}

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

    const { rows, columns } = calculateGrid({
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
    this.canvasHelper.canvas.addEventListener(
      "click",
      (evt) =>
        setTargetParticleState(
          evt,
          this.canvasHelper,
          this.grid,
          this.settings.svgWidth,
          "fadeOut",
        ),
    );

    this.canvasHelper.canvas.addEventListener(
      "mousemove",
      (evt: MouseEvent) =>
        setTargetParticleState(
          evt,
          this.canvasHelper,
          this.grid,
          this.settings.svgWidth,
          "hover",
        ),
    );
  }

  loadSvg(settings: GeneralSettings, canvasHelper: CanvasHelper) {
    const { svg, svgQuery, colours } = settings;

    let i = colours.length;
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

    const { rows, columns } = calculateGrid({
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
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridColumns; col++) {
        this.grid[row][col].update();
      }
    }
  }

  draw() {
    clearCanvas({
      canvas: this.canvasHelper.canvas,
      context: this.canvasHelper.context,
    });

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridColumns; col++) {
        this.grid[row][col].draw();
      }
    }
  }
}

function setTargetParticleState(
  evt: MouseEvent,
  canvasHelper: CanvasHelper,
  grid: MatrixGrid,
  cellWidth: number,
  particleState: AnimationState,
) {
  const [mouseX, mouseY] = getMouseCoordinates(evt, canvasHelper);
  const clickedParticle = findParticle(
    mouseX,
    mouseY,
    grid,
    cellWidth,
  );
  clickedParticle.state = particleState;
}

function populateGrid(
  rows: number,
  columns: number,
  settings: GeneralSettings,
  canvasHelper: CanvasHelper,
) {
  const grid = new Array(rows);

  for (let row = 0; row < rows; row++) {
    grid[row] = new Array(columns);
    for (let col = 0; col < columns; col++) {
      const particle = new ParticleHelper({
        width: settings.svgWidth,
        height: settings.svgWidth,
        arrayPositionX: row,
        arrayPositionY: col,
        CanvasContext: canvasHelper.context,
        offScreenCanvas: canvasHelper.offScreenSpriteCanvas,
        numOfColours: settings.colours.length,
      });
      grid[row][col] = particle;
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

  // check for edge cases where co-ordinates are negative
  const row = x > 0 ? x : 0;
  const col = y > 0 ? y : 0;

  return grid[row][col];
}

function calculateGrid(
  { canvasWidth, canvasHeight, particleWidth, particleHeight }: GridParams,
) {
  const rows = Math.floor(canvasWidth / particleWidth);
  const columns = Math.floor(canvasHeight / particleHeight);

  return { rows, columns };
}

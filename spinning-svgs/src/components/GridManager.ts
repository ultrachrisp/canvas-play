import { GeneralSettings } from "../types";
import { CanvasHelper, clearCanvas } from "./CanvasHelper";
import { AnimationState, ParticleHelper } from "./Particle";

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
      cellWidth: this.settings.svgWidth,
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
      cellWidth: this.settings.svgWidth,
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
  const { mouseX, mouseY } = getRelativeMousePostion({
    evt,
    canvas: canvasHelper.canvas,
  });
  const { row, column } = getMouseToGridPosition({
    mouseX,
    mouseY,
    cellWidth,
  });
  grid[row][column].state = particleState;
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

function getRelativeMousePostion(
  { evt, canvas }: { evt: MouseEvent; canvas: HTMLCanvasElement },
) {
  const { left, top } = canvas.getBoundingClientRect();
  const mouseX = evt.clientX - left;
  const mouseY = evt.clientY - top;
  return { mouseX, mouseY };
}

function getMouseToGridPosition({ mouseX, mouseY, cellWidth }: {
  mouseX: number;
  mouseY: number;
  cellWidth: number;
}) {
  const x = Math.floor(mouseX / cellWidth);
  const y = Math.floor(mouseY / cellWidth);

  // check for edge cases where co-ordinates are negative
  const row = x > 0 ? x : 0;
  const column = y > 0 ? y : 0;

  return { row, column };
}

function calculateGrid(
  { canvasWidth, canvasHeight, cellWidth }: {
    canvasWidth: number;
    canvasHeight: number;
    cellWidth: number;
  },
) {
  const rows = Math.floor(canvasWidth / cellWidth);
  const columns = Math.floor(canvasHeight / cellWidth);

  return { rows, columns };
}

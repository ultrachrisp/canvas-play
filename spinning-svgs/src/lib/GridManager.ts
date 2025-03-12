import { GeneralSettings } from "../SpinningSVGs";
import { ParticleHelper } from "./Particle";

export type MatrixGrid = Array<Array<ParticleHelper>>;

export class GridManager {
  protected grid: MatrixGrid;
  protected gridRows: number;
  protected gridColumns: number;
  protected cellWidth: number;
  protected numOfSprites: number;

  constructor({ settings, canvasWidth, canvasHeight }: {
    settings: GeneralSettings;
    canvasWidth: number;
    canvasHeight: number;
  }) {
    this.cellWidth = settings.svgWidth;
    this.numOfSprites = settings.colours.length;

    const { rows, columns } = calculateGrid({
      canvasWidth,
      canvasHeight,
      cellWidth: settings.svgWidth,
    });

    this.gridRows = rows;
    this.gridColumns = columns;

    this.grid = populateGrid({
      rows: this.gridRows,
      columns: this.gridColumns,
      cellWidth: this.cellWidth,
      numOfSprites: this.numOfSprites,
    });
  }

  getGrid() {
    return this.grid;
  }

  resize({ canvasWidth, canvasHeight }: {
    canvasWidth: number;
    canvasHeight: number;
  }) {
    const { rows, columns } = calculateGrid({
      canvasWidth,
      canvasHeight,
      cellWidth: this.cellWidth,
    });

    this.gridRows = rows;
    this.gridColumns = columns;

    this.grid = populateGrid({
      rows,
      columns,
      cellWidth: this.cellWidth,
      numOfSprites: this.numOfSprites,
    });
  }

  update({ speedFactor }: { speedFactor: DOMHighResTimeStamp }) {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridColumns; col++) {
        this.grid[row][col].update({ speedFactor });
      }
    }
  }

  draw(
    { context, spriteSheet }: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridColumns; col++) {
        this.grid[row][col].draw({ context, spriteSheet });
      }
    }
  }
}

function populateGrid({
  rows,
  columns,
  cellWidth,
  numOfSprites,
}: {
  rows: number;
  columns: number;
  cellWidth: number;
  numOfSprites: number;
}) {
  const grid = new Array(rows);

  for (let row = 0; row < rows; row++) {
    grid[row] = new Array(columns);
    for (let col = 0; col < columns; col++) {
      const particle = new ParticleHelper({
        width: cellWidth,
        height: cellWidth,
        arrayPositionX: row,
        arrayPositionY: col,
        numOfColours: numOfSprites,
      });
      grid[row][col] = particle;
    }
  }

  return grid;
}

export function getRelativeMousePostion(
  { evt, canvas }: { evt: MouseEvent; canvas: HTMLCanvasElement },
) {
  const { left, top } = canvas.getBoundingClientRect();
  const mouseX = evt.clientX - left;
  const mouseY = evt.clientY - top;

  return { mouseX, mouseY };
}

export function getMouseToGridPosition({ mouseX, mouseY, cellWidth }: {
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

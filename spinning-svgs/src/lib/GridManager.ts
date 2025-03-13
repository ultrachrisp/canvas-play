import { GeneralSettings } from "../SpinningSVGs";
import { Particle, ParticleType } from "./Particle";

export type MatrixGrid = Array<Array<ParticleType>>;

export function GridManager({ settings, canvasWidth, canvasHeight }: {
  settings: GeneralSettings;
  canvasWidth: number;
  canvasHeight: number;
}) {
  const cellWidth = settings.svgWidth;
  const numOfSprites = settings.colours.length;

  let { gridRows, gridColumns } = calculateGrid({
    canvasWidth,
    canvasHeight,
    cellWidth,
  });

  let grid = populateGrid({
    gridRows,
    gridColumns,
    cellWidth,
    numOfSprites,
  });

  function getGrid() {
    return grid;
  }

  function resize({ canvasWidth, canvasHeight }: {
    canvasWidth: number;
    canvasHeight: number;
  }) {
    ({ gridRows, gridColumns } = calculateGrid({
      canvasWidth,
      canvasHeight,
      cellWidth,
    }));

    grid = populateGrid({
      gridRows,
      gridColumns,
      cellWidth,
      numOfSprites,
    });
  }

  function update({ speedFactor }: { speedFactor: DOMHighResTimeStamp }) {
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        grid[row][col].update({ speedFactor });
      }
    }
  }

  function draw(
    { context, spriteSheet }: {
      context: CanvasRenderingContext2D;
      spriteSheet: HTMLCanvasElement;
    },
  ) {
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        grid[row][col].draw({ context, spriteSheet });
      }
    }
  }

  return { getGrid, resize, update, draw };
}

function populateGrid({
  gridRows,
  gridColumns,
  cellWidth,
  numOfSprites,
}: {
  gridRows: number;
  gridColumns: number;
  cellWidth: number;
  numOfSprites: number;
}) {
  const grid = new Array(gridRows);

  for (let row = 0; row < gridRows; row++) {
    grid[row] = new Array(gridColumns);
    for (let col = 0; col < gridColumns; col++) {
      const particle = Particle({
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
  const gridRows = Math.floor(canvasWidth / cellWidth);
  const gridColumns = Math.floor(canvasHeight / cellWidth);

  return { gridRows, gridColumns };
}

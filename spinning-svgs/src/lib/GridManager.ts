import { Particle } from "./Particle.ts";

/**
 * A GridManager is a class that manages a matrix of Particles, all of which
 * are drawn on a single canvas. It can be used to create animations of
 * spinning svgs.
 *
 * @param {Object} args - Settings for the GridManager.
 * @param {number} args.cellWidth - The width of each cell in the grid.
 * @param {number} args.numOfSprites - The number of sprites that will be drawn on the canvas.
 * @param {number} args.canvasWidth - The width of the canvas.
 * @param {number} args.canvasHeight - The height of the canvas.
 * @returns {Object} A GridManager object with methods to `getGrid`, `resize`,
 *   `update`, `draw`, and `prepareWave`.
 */
export function GridManager(
  { cellWidth, numOfSprites, canvasWidth, canvasHeight }: {
    cellWidth: number;
    numOfSprites: number;
    canvasWidth: number;
    canvasHeight: number;
  },
) {
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

  function prepareWave(
    { targetRow, targetColumn }: { targetRow: number; targetColumn: number },
  ) {
    const targetParticle = grid[targetRow][targetColumn];
    targetParticle.setParticleState("click");

    const { arrayPositionX: targetX, arrayPositionY: targetY } = targetParticle
      .getArrayPosition();

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        const { arrayPositionX, arrayPositionY } = grid[row][col]
          .getArrayPosition();
        const distance = Math.abs(targetX - arrayPositionX) +
          Math.abs(targetY - arrayPositionY);
        grid[row][col].setDistanceToTarget(distance, "wave");
      }
    }
  }

  function update(
    { frame, speedFactor }: { frame: number; speedFactor: number },
  ) {
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        grid[row][col].update({ frame, speedFactor });
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

  return { getGrid, resize, update, draw, prepareWave };
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

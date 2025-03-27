import { AnimationTimer } from "./lib/AnimationTimer.ts";
import { CanvasManager } from "./lib/CanvasManager.ts";
import {
  getMouseToGridPosition,
  getRelativeMousePostion,
  GridManager,
} from "./lib/GridManager.ts";

/**
 * Represents the general settings for the spinning SVG animation.
 * @interface GeneralSettings
 * @property {string} tag - A valid HTML tag that exists in the DOM.
 * @property {string} svg - The SVG string that will be used in the animation.
 * @property {string} svgQuery - A query string that will be replaced with the values in `colours`.
 * @property {number} svgWidth - The width of the SVG when rendered on the canvas.
 * @property {Array<string>} colours - An array of colours that will be used for the animation.
 */
export interface GeneralSettings {
  tag: string;
  svg: string;
  svgQuery: string;
  svgWidth: number;
  colours: Array<string>;
}

/**
 * Initialises a canvas element with an animation of spinning svgs.
 * @param {Object} settings - Settings for the animation.
 * @param {string} settings.tag - A valid HTML tag that exists in the DOM.
 * @param {string} settings.svg - The SVG string that will be used in the animation.
 * @param {string} settings.svgQuery - A query string that will be replaced with the values in settings.colours.
 * @param {number} settings.svgWidth - The width of the svg when rendered on the canvas.
 * @param {Array<string>} settings.colours - An array of colours that will be used for the animation.
 * @memberof SpinningSVGs
 */
export function SpinningSVGs({ settings }: { settings: GeneralSettings }) {
  const animationTimer = AnimationTimer();
  const canvasManager = CanvasManager({ settings });
  const { canvasWidth, canvasHeight } = canvasManager.resize();
  const gridManager = GridManager({
    cellWidth: settings.svgWidth,
    numOfSprites: settings.colours.length,
    canvasWidth,
    canvasHeight,
  });
  let screenWidth = globalThis.innerWidth;

  addEventListener("resize", debounce(() => onResize(), 300));
  canvasManager.getCanvas().addEventListener(
    "click",
    (evt) => {
      const { row, column } = getTargetParticleState(
        evt,
        canvasManager.getCanvas(),
        settings.svgWidth,
      );
      gridManager.prepareWave({ targetRow: row, targetColumn: column });
    },
  );

  canvasManager.getCanvas().addEventListener(
    "mousemove",
    (evt) => {
      const { row, column } = getTargetParticleState(
        evt,
        canvasManager.getCanvas(),
        settings.svgWidth,
      );
      gridManager.getGrid()[row][column].setParticleState("hover");
    },
  );

  function onResize() {
    if (screenWidth !== globalThis.innerWidth) { // prevent unneeded reSizes on mobile devices
      animationTimer.setFrame(0);
      const { canvasWidth, canvasHeight } = canvasManager.resize();
      gridManager.resize({ canvasWidth, canvasHeight });
      screenWidth = globalThis.innerWidth;
    }
  }

  function updateParticles() {
    gridManager.update({ ...animationTimer.getFrame() });
  }

  function renderParticles() {
    canvasManager.draw();
    gridManager.draw({
      context: canvasManager.getContext(),
      spriteSheet: canvasManager.getOffscreenCanvas(),
    });
  }

  function animationLoop(timeStamp: DOMHighResTimeStamp) {
    animationTimer.setTimestamp(timeStamp);

    updateParticles();
    renderParticles();

    requestAnimationFrame(animationLoop);
  }

  onResize();
  animationLoop(performance.now());
}

function getTargetParticleState(
  evt: MouseEvent,
  canvas: HTMLCanvasElement,
  cellWidth: number,
) {
  const { mouseX, mouseY } = getRelativeMousePostion({
    evt,
    canvas,
  });

  return getMouseToGridPosition({
    mouseX,
    mouseY,
    cellWidth,
  });
}

function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

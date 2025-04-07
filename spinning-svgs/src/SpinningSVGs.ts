import { AnimationTimer } from "./lib/AnimationTimer.ts";
import { CanvasManager } from "./lib/CanvasManager.ts";
import {
  getMouseToGridPosition,
  getRelativeMousePostion,
  GridManager,
} from "./lib/GridManager.ts";

import { DebuggingWindow } from "./lib/DebugWindow.ts";

/**
 * Represents the general settings for the spinning SVG animation.
 *
 * @interface
 * @property tag - A valid HTML tag that exists in the DOM.
 * @property svg - The SVG string that will be used in the animation.
 * @property svgQuery - A query string that will be replaced with the values in `colours`.
 * @property svgWidth - The width of the SVG when rendered on the canvas.
 * @property colours - An array of colours that will be used for the animation.
 * @property colours - Toggle the visibility of the debug window
 */
export interface GeneralSettings {
  tag: string;
  svg: string;
  svgQuery: string;
  svgWidth: number;
  colours: Array<string>;
  showDebug: boolean;
}

/**
 * Initializes a canvas element with an animation of spinning SVGs.
 *
 * @param settings - Settings for the animation.
 * @param settings.tag - A valid HTML tag that exists in the DOM.
 * @param settings.svg - The SVG string that will be used in the animation.
 * @param settings.svgQuery - A query string that will be replaced with the values in `settings.colours`.
 * @param settings.svgWidth - The width of the SVG when rendered on the canvas.
 * @param settings.colours - An array of colors that will be used for the animation.
 */
export function SpinningSVGs({ settings }: { settings: GeneralSettings }) {
  DebuggingWindow({ settings })

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

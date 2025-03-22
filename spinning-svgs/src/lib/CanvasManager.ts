import type { GeneralSettings } from "../SpinningSVGs.ts";

type CanvasType = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

/**
 * Manages the canvas for the spinning SVG animation.
 * @param {Object} settings - Settings for the animation.
 * @param {string} settings.tag - A valid HTML tag that exists in the DOM.
 * @param {string} settings.svg - The SVG string that will be used in the animation.
 * @param {string} settings.svgQuery - A query string that will be replaced with the values in settings.colours.
 * @param {number} settings.svgWidth - The width of the svg when rendered on the canvas.
 * @param {Array<string>} settings.colours - An array of colours that will be used for the animation.
 * @returns {Object} - An object containing the following functions:
 *  - getContext: Returns the 2D drawing context of the canvas.
 *  - getCanvas: Returns the canvas.
 *  - getOffscreenCanvas: Returns the offscreen canvas used for the sprite sheet.
 *  - resize: Resizes the canvas based on the new canvas dimensions.
 *  - draw: Draws the grid of particles onto the given context.
 */
export function CanvasManager({ settings }: { settings: GeneralSettings }) {
  const { tag, colours, svgWidth: cellWidth } = settings;

  const queryElement = document.querySelector(tag);
  if (!queryElement) {
    throw new Error(
      "Provided canvas tag does not exist in the HTML document",
    );
  }
  const element = queryElement;

  element.replaceChildren();
  const { canvas, context } = create2dCanvas();
  element.appendChild(canvas);
  element.setAttribute(
    "style",
    "box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;",
  );

  const { canvas: offScreenSpriteCanvas, context: offScreenSpriteContext } =
    create2dCanvas();
  offScreenSpriteCanvas.width = colours.length * cellWidth;
  offScreenSpriteCanvas.height = cellWidth;
  loadSvg({ settings, spriteContext: offScreenSpriteContext });

  function getContext() {
    return context;
  }

  function getCanvas() {
    return canvas;
  }

  function getOffscreenCanvas() {
    return offScreenSpriteCanvas;
  }

  function resize() {
    clearCanvas({ canvas, context });
    const { canvasWidth, canvasHeight } = getAvailableSpace(
      element,
      cellWidth,
    );

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    return { canvasWidth, canvasHeight };
  }

  function draw() {
    clearCanvas({ canvas, context });
  }

  return { resize, draw, getCanvas, getContext, getOffscreenCanvas };
}

function loadSvg(
  { settings, spriteContext }: {
    settings: GeneralSettings;
    spriteContext: CanvasRenderingContext2D;
  },
) {
  const { svg, svgQuery, colours, svgWidth } = settings;

  let i = colours.length;
  while (i--) {
    const result = svg.replace(svgQuery, colours[i]);
    const uri = encodeURIComponent(result);
    const img = new Image();
    const xOffset = i * svgWidth;

    img.onload = () => {
      spriteContext.drawImage(img, xOffset, 0, svgWidth, svgWidth);
    };
    img.src = `data:image/svg+xml,${uri}`;
  }
}

function clearCanvas({ canvas, context }: CanvasType) {
  return context.clearRect(0, 0, canvas.width, canvas.height);
}

function create2dCanvas(): CanvasType {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get 2D canvas context");

  return { canvas, context };
}

function getAvailableSpace(element: Element, cellWidth: number) {
  const { width, height } = element.getBoundingClientRect();
  const canvasWidth = Math.floor(width / cellWidth) * cellWidth;
  const canvasHeight = Math.floor(height / cellWidth) * cellWidth;

  return { canvasWidth, canvasHeight };
}

import { GeneralSettings } from "../SpinningSVGs.ts";

type CanvasType = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

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

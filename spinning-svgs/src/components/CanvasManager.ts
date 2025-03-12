import { GeneralSettings } from "../types";

type CanvasType = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

export class CanvasManager {
  protected element: Element;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected offScreenSpriteCanvas: HTMLCanvasElement;
  protected offScreenSpriteContext: CanvasRenderingContext2D;
  protected cellWidth: number;

  constructor(settings: GeneralSettings) {
    const element = document.querySelector(settings.tag);
    if (!element) {
      throw new Error(
        "Provided canvas tag does not exist in the HTML document",
      );
    }

    element.replaceChildren();
    this.element = element;

    let { canvas, context } = create2dCanvas();
    this.canvas = canvas;
    this.context = context;
    this.element.appendChild(this.canvas);

    ({ canvas, context } = create2dCanvas());
    this.offScreenSpriteCanvas = canvas;
    this.offScreenSpriteContext = context;

    this.offScreenSpriteCanvas.width = settings.colours.length *
      settings.svgWidth;
    this.offScreenSpriteCanvas.height = settings.svgWidth;
    loadSvg({ settings, spriteContext: this.offScreenSpriteContext });

    this.cellWidth = settings.svgWidth;
    this.resize();
  }

  getCanvasAndContext(): CanvasType {
    return { canvas: this.canvas, context: this.context };
  }

  getContext() {
    return this.context;
  }

  getCanvas() {
    return this.canvas;
  }

  getOffscreenContext() {
    return this.offScreenSpriteContext;
  }

  getOffscreenCanvas() {
    return this.offScreenSpriteCanvas;
  }

  resize() {
    clearCanvas({ canvas: this.canvas, context: this.context });
    const { canvasWidth, canvasHeight } = getAvailableSpace(
      this.element,
      this.cellWidth,
    );

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    return { canvasWidth, canvasHeight };
  }

  draw() {
    clearCanvas({ canvas: this.canvas, context: this.context });
  }
}

function loadSvg(
  { settings, spriteContext }: {
    settings: GeneralSettings;
    spriteContext: CanvasRenderingContext2D;
  },
) {
  const { svg, svgQuery, colours } = settings;

  let i = colours.length;
  while (i--) {
    const result = svg.replace(svgQuery, colours[i]);
    const uri = encodeURIComponent(result);
    const img = new Image();
    const xOffset = i * settings.svgWidth;

    img.onload = () => {
      spriteContext.drawImage(
        img,
        xOffset,
        0,
        settings.svgWidth,
        settings.svgWidth,
      );
    };
    img.src = `data:image/svg+xml,${uri}`;
  }
}

function clearCanvas({ canvas, context }: CanvasType) {
  return context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

function create2dCanvas(): CanvasType {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get 2D canvas context");

  return { canvas, context };
}

function getAvailableSpace(element: Element, cellWidth: number) {
  const { width, height } = element.getBoundingClientRect();
  const canvasWidth = Math.floor(width / cellWidth) *
    cellWidth;
  const canvasHeight = Math.floor(height / cellWidth) *
    cellWidth;

  return { canvasWidth, canvasHeight };
}

import { GeneralSettings } from "../types";

type CanvasType = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

export class CanvasHelper {
  settings: GeneralSettings;
  element: Element;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  offScreenSpriteCanvas: HTMLCanvasElement;
  offScreenSpriteContext: CanvasRenderingContext2D;

  constructor(settings: GeneralSettings) {
    this.settings = settings;

    const element = document.querySelector(this.settings.tag);
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

    this.offScreenSpriteCanvas.width = this.settings.colours.length *
      this.settings.svgWidth;
    this.offScreenSpriteCanvas.height = this.settings.svgWidth;
  }

  init() {
    this.resize();
  }

  resize() {
    const { canvasWidth, canvasHeight } = getAvailableSpace(
      this.element,
      this.settings.svgWidth,
    );

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
  }
}

export function clearCanvas({ canvas, context }: CanvasType) {
  return context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

function create2dCanvas() {
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

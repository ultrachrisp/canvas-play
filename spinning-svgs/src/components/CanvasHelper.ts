import { GeneralSettings } from "../types";

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

    emptyElement(element);
    this.element = element;

    [this.canvas, this.context] = create2dCanvas();
    this.element.appendChild(this.canvas);

    [this.offScreenSpriteCanvas, this.offScreenSpriteContext] =
      create2dCanvas();

    // creating a single canvas for all the colours
    this.offScreenSpriteCanvas.width = this.settings.colours.length *
      this.settings.svgWidth;
    this.offScreenSpriteCanvas.height = this.settings.svgWidth;
    // this.element.appendChild(this.offScreenSpriteCanvas);

    // this.selectedParticle = {
    //   positionX: -1,
    //   positionY: -1
    // }
  }

  init() {
    this.resize();
  }

  resize() {
    [this.canvas.width, this.canvas.height] = getAvailableSpace(
      this.element,
      this.settings.svgWidth,
    );
  }
}

function emptyElement(element: Element) {
  element.replaceChildren();
}

function create2dCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get 2D canvas context");

  return [canvas, context];
}

function getAvailableSpace(element: Element, cellWidth: number) {
  const { width, height } = element.getBoundingClientRect();
  const canvasWidth = Math.floor(width / cellWidth) *
    cellWidth;
  const canvasHeight = Math.floor(height / cellWidth) *
    cellWidth;

  /** Usful to keep a square shape*/
  // const possibleHeight = window.innerHeight - (boundingRect.top * 2);
  // const canvasHeight = (canvasWidth > possibleHeight) ? possibleHeight : canvasWidth;

  return [canvasWidth, canvasHeight];
}

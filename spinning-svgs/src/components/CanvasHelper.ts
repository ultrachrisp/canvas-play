import { GeneralSettings } from "../types";

export class CanvasHelper {
  settings: GeneralSettings;
  element: Element;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

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
  }

  init() {
    this.resize();
  }

  resize() {
    [this.canvas.width, this.canvas.height] = getAvailableSpace(
      this.element,
      this.settings,
    );
  }
}

function emptyElement(element: Element) {
  element.replaceChildren();
}

function create2dCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get context");

  return [canvas, context];
}

function getAvailableSpace(element: Element, settings: GeneralSettings) {
  const canvasWidth = Math.floor(element.getBoundingClientRect().width / settings.svgWidth) *
    settings.svgWidth;
  const canvasHeight = Math.floor(element.getBoundingClientRect().height / settings.svgWidth) *
    settings.svgWidth;

  /** Usful to keep a square shape*/
  // const possibleHeight = window.innerHeight - (boundingRect.top * 2);
  // const canvasHeight = (canvasWidth > possibleHeight) ? possibleHeight : canvasWidth;

  return [canvasWidth, canvasHeight];
}

import { GeneralSettings } from "../types";

export class CanvasHelper {
  settings: GeneralSettings;
  element: Element;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

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

    this.canvas = document.createElement("canvas");
    this.element.appendChild(this.canvas);
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Failed to get context");
    this.context = context;
  }

  init() {
    this.resize();
  }

  resize() {
    const [canvasWidth, canvasHeight] = getAvailableSpace(
      this.element,
      this.settings,
    );
    this.canvasWidth = this.canvas.width = canvasWidth;
    this.canvasHeight = this.canvas.height = canvasHeight;
  }
}

function emptyElement(element: Element) {
  element.replaceChildren();
}

function getAvailableSpace(element: Element, settings: GeneralSettings) {
  const boundingRect = element.getBoundingClientRect();
  const availableWidth = boundingRect.width;
  const availableHeight = boundingRect.height;
  const canvasWidth = Math.floor(availableWidth / settings.svgWidth) *
    settings.svgWidth;
  // const canvasHeight = window.innerHeight - (boundingRect.top * 2);
  const canvasHeight = Math.floor(availableHeight / settings.svgWidth) *
    settings.svgWidth;

  /** Usful to keep a square shape*/
  // const possibleHeight = window.innerHeight - (boundingRect.top * 2);
  // const canvasHeight = (canvasWidth > possibleHeight) ? possibleHeight : canvasWidth;

  return [canvasWidth, canvasHeight];
}

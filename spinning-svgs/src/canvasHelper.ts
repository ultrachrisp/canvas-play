import { CanvasObject, GeneralSettings, GridParams, LoadSVG } from "./types";

export function createCanvas(settings: GeneralSettings): CanvasObject {
  const element = document.querySelector(settings.tag);

  if (!element) {
    throw new Error("Provided canvas tag does not exist in the HTML document");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get context");

  const svgWidth = settings.svgWidth;

  element.innerHTML = "";
  element.appendChild(canvas);

  const { canvasWidth, canvasHeight } = initCanvasSize({ canvas, element });
  const grid = setGrid({
    canvasWidth,
    canvasHeight,
    particleWidth: svgWidth,
    particleHeight: svgWidth,
  });

  return {
    canvas,
    element,
    context: context,
    grid,
    width: canvasWidth,
    height: canvasHeight,
    particleWidth: svgWidth,
    particleHeight: svgWidth,
    xOffset: 0,
    yOffset: 0,
  };
}

function initCanvasSize(
  { canvas, element }: { canvas: HTMLCanvasElement; element: Element },
) {
  const { canvasWidth, canvasHeight } = getCanvasDimensions(element);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  return { canvasWidth, canvasHeight };
}

export function setCanvasSize(obj: CanvasObject) {
  const { canvasWidth, canvasHeight } = getCanvasDimensions(obj.element);

  obj.width = obj.canvas.width = canvasWidth;
  obj.height = obj.canvas.height = canvasHeight;
  obj.xOffset = Math.floor(obj.width % obj.particleWidth) / 2;
  obj.yOffset = Math.floor(obj.height % obj.particleHeight) / 2;

  obj.grid = setGrid({
    canvasWidth,
    canvasHeight,
    particleWidth: obj.particleWidth,
    particleHeight: obj.particleHeight,
  });
}

function setGrid(
  { canvasWidth, canvasHeight, particleWidth, particleHeight }: GridParams,
): Array<Array<number>> {
  const rows = Math.floor(canvasHeight / particleHeight);
  const coloumns = Math.floor(canvasWidth / particleWidth);

  return (new Array(coloumns).fill(0).map(() => new Array(rows).fill(0)));
}

function getCanvasDimensions(element: Element) {
  const boundingRect = element.getBoundingClientRect();
  const canvasWidth = boundingRect.width;
  const canvasHeight = window.innerHeight - (boundingRect.top * 2);

  /** Usful to keep a square shape*/
  // const possibleHeight = window.innerHeight - (boundingRect.top * 2);
  // const canvasHeight = (canvasWidth > possibleHeight) ? possibleHeight : canvasWidth;

  return { canvasWidth, canvasHeight };
}

export function loadSvg({ settings, obj, x, y }: LoadSVG) {
  const { svg, svgQuery, colours } = settings,
    result = svg.replace(svgQuery, colours[1]),
    uri = encodeURIComponent(result),
    img = new Image();

  img.onload = () => {
    const xPos = (x * obj.particleWidth) + obj.xOffset;
    const yPos = (y * obj.particleHeight) + obj.yOffset;
    obj.context.drawImage(img, xPos, yPos);
  };
  img.src = `data:image/svg+xml,${uri}`;
}

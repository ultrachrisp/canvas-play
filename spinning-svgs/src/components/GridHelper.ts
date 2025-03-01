import { GeneralSettings, LoadSVG } from "../types";
import { CanvasHelper } from "./CanvasHelper";

interface GridParams {
  canvasWidth: number;
  canvasHeight: number;
  particleWidth: number;
  particleHeight: number;
}

export class GridHelper {
  grid: Array<Array<number>>;
  settings: GeneralSettings;
  canvasHelper: CanvasHelper;

  constructor(
    canvasHelper: CanvasHelper,
    settings: GeneralSettings,
  ) {
    this.settings = settings;
    this.canvasHelper = canvasHelper;

    this.grid = setGrid({
      canvasWidth: this.canvasHelper.canvasWidth,
      canvasHeight: this.canvasHelper.canvasHeight,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });
  }

  init() {
    this.populateGrid();
    console.log("init: ", this.grid);
    console.log("init: ", this.canvasHelper);
  }

  populateGrid() {
    this.grid.forEach((row, x) => {
      row.forEach((_, y) => {
        this.loadSvg({ settings: this.settings, obj: this.canvasHelper, x, y });
      });
    });
  }

  loadSvg({ settings, obj, x, y }: LoadSVG) {
    const { svg, svgQuery, colours } = settings,
      result = svg.replace(svgQuery, colours[1]),
      uri = encodeURIComponent(result),
      img = new Image();

    img.onload = () => {
      // const xPos = (x * obj.particleWidth) + obj.xOffset;
      // const yPos = (y * obj.particleHeight) + obj.yOffset;
      const xPos = x * settings.svgWidth;
      const yPos = y * settings.svgWidth;
      obj.context.drawImage(img, xPos, yPos);
    };
    img.src = `data:image/svg+xml,${uri}`;
  }

  resize() {
    this.grid = setGrid({
      canvasWidth: this.canvasHelper.canvasWidth,
      canvasHeight: this.canvasHelper.canvasHeight,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });
    this.populateGrid();
    console.log("resize: ", this.grid);
    console.log("resize: ", this.canvasHelper);
  }
  update() {}
}

function setGrid(
  { canvasWidth, canvasHeight, particleWidth, particleHeight }: GridParams,
): Array<Array<number>> {
  const rows = Math.floor(canvasHeight / particleHeight);
  const coloumns = Math.floor(canvasWidth / particleWidth);

  return (new Array(coloumns).fill(0).map(() => new Array(rows).fill(0)));
}

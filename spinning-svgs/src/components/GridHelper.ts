import { GeneralSettings, LoadSVG } from "../types";
import { CanvasHelper } from "./CanvasHelper";
import { ParticleHelper } from "./ParticleHelper";

interface GridParams {
  canvasWidth: number;
  canvasHeight: number;
  particleWidth: number;
  particleHeight: number;
}

export class GridHelper {
  grid: Array<Array<number | ParticleHelper>>;
  settings: GeneralSettings;
  canvasHelper: CanvasHelper;
  particles: Array<ParticleHelper>;
  image: HTMLImageElement;

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

    this.particles = [];
    // this.image = this.loadSvg({ settings: this.settings, obj: this.canvasHelper, x, y });
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

        const particle = new ParticleHelper({
          width: this.settings.svgWidth,
          height: this.settings.svgWidth,
          arrayPositionX: x,
          arrayPositionY: y,
          CanvasContext: this.canvasHelper.context,
        });

        // unsure that I need both
        this.particles.push(particle);
        this.grid[x][y] = particle;
      });
    });
  }

  loadSvg({ settings, obj, x, y }: LoadSVG) {
    const { svg, svgQuery, colours } = settings;
    const result = svg.replace(svgQuery, colours[1]);
    const uri = encodeURIComponent(result);
    const img = new Image();

    img.onload = () => {
      const xPos = x * settings.svgWidth;
      const yPos = y * settings.svgWidth;
      obj.context.drawImage(img, xPos, yPos);
    };
    img.src = `data:image/svg+xml,${uri}`;
    return img;
  }

  resize() {
    this.grid = setGrid({
      canvasWidth: this.canvasHelper.canvasWidth,
      canvasHeight: this.canvasHelper.canvasHeight,
      particleWidth: this.settings.svgWidth,
      particleHeight: this.settings.svgWidth,
    });
    this.populateGrid();

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

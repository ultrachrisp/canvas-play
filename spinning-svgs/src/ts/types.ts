export interface GeneralSettings {
  tag: string;
  svg: string;
  svgQuery: string;
  svgWidth: number;
  colours: Array<string>;
}

export interface CanvasObject {
  element: Element;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  grid: Array<Array<number>>;
  width: number;
  height: number;
  particleWidth: number;
  particleHeight: number;
  xOffset: number;
  yOffset: number;
}

export interface LoadSVG {
  settings: GeneralSettings;
  obj: CanvasObject;
  x: number;
  y: number;
}

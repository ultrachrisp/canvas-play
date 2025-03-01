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
  // grid: Array<Array<number>>;
  canvasWidth: number;
  canvasHeight: number;
  // particleWidth: number;
  // particleHeight: number;
  // xOffset: number;
  // yOffset: number;
  // start: DOMHighResTimeStamp;
  // currentTime: DOMHighResTimeStamp;
}

export interface GridParams {
  canvasWidth: number;
  canvasHeight: number;
  particleWidth: number;
  particleHeight: number;
}

export interface LoadSVG {
  settings: GeneralSettings;
  obj: CanvasObject;
  x: number;
  y: number;
}

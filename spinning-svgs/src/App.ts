import { CanvasHelper } from "./components/CanvasHelper";

export class App {
  canvasHelper: CanvasHelper;
  constructor(tag: string) {
    this.canvasHelper = new CanvasHelper(tag);
    this.canvasHelper.init();

  }
  init() {}
  resize() {}
  update() {}
}

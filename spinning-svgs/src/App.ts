import { CanvasHelper } from "./components/CanvasHelper";

export class App {
  canvasHelper: CanvasHelper;

  constructor(tag: string) {
    this.canvasHelper = new CanvasHelper(tag);
    this.canvasHelper.init();
  }

  async init() {
    this.resize();
    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    this.canvasHelper.resize();
  }

  update() {}
}

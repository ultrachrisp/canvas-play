export class CanvasHelper {
  element: Element;
  canvas: HTMLCanvasElement;

  constructor(tag: string) {
    const element = document.querySelector(tag);
    if (!element) {
      throw new Error("Provided canvas tag does not exist in the HTML document");
    }

    this.emptyElement(element);
    this.element = element;

    this.canvas = document.createElement("canvas");
    this.element.appendChild(this.canvas);
  }

  init() {
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Failed to get context");

    this.resize();
    window.addEventListener('resize', () => this.resize())
  };

  emptyElement(element: Element) {
    element.replaceChildren();
  }

  resize() {
    const [canvasWidth, canvasHeight] = this.getAvailableSpace(this.element);
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
  }

  getAvailableSpace(element: Element) {
    const boundingRect = element.getBoundingClientRect();
    const canvasWidth = boundingRect.width;
    const canvasHeight = window.innerHeight - (boundingRect.top * 2);

    /** Usful to keep a square shape*/
    // const possibleHeight = window.innerHeight - (boundingRect.top * 2);
    // const canvasHeight = (canvasWidth > possibleHeight) ? possibleHeight : canvasWidth;

    return [canvasWidth, canvasHeight];
  }


}

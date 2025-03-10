import { AnimationTimer } from "./components/AnimationTimer";
import { CanvasHelper } from "./components/CanvasHelper";
import { GridHelper } from "./components/GridManager";
import { GeneralSettings } from "./types.d";

const settings: GeneralSettings = {
  tag: "#canvas",
  svg:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 115" width="75px" height="75px"><defs><style>.cls-1,.cls-2,.cls-3{fill:none;}.cls-1,.cls-2,.cls-3,.cls-4{stroke:%COLOUR%;stroke-miterlimit:10;}.cls-1,.cls-2{stroke-linecap:round;}.cls-2,.cls-3,.cls-4{stroke-width:5px;}.cls-4{fill:#fff;}</style></defs><g><path class="cls-2" d="M33.18,26.1a40,40,0,0,1,54,4.8"/><path class="cls-3" d="M87.15,30.9A40,40,0,0,1,94.23,74"/><circle class="cls-4" cx="94.38" cy="73.73" r="8"/><path class="cls-2" d="M82.38,89.47a40,40,0,0,1-54-4.8"/><path class="cls-3" d="M28.41,84.67a40.09,40.09,0,0,1-7.08-43.15"/><circle class="cls-4" cx="21.18" cy="41.84" r="8"/></g></svg>',
  svgQuery: "%COLOUR%",
  svgWidth: 75,
  // colours: ["#000000", "#73505d", "#312f43", "#5c7364", "#736d5c", "#3a3834"],
  colours: ["#000000", "#73505d", "#615b8f", "#5c7364", "#736d5c", "#ada555"],
};

const animationTimer = AnimationTimer.getInstance();
const canvasHelper = new CanvasHelper(settings);
const gridHelper = new GridHelper(canvasHelper, settings);

export function StartApp() {
  canvasHelper.init();
  gridHelper.init();

  onResize();
  animationLoop(performance.now());

  addEventListener("resize", debounce(() => onResize(), 300));
}

function onResize() {
  canvasHelper.resize();
  gridHelper.resize();
}

function updateParticles() {
  gridHelper.update();
}

function renderParticles() {
  gridHelper.draw();
}

function animationLoop(timeStamp: DOMHighResTimeStamp) {
  animationTimer.setTimestamp(timeStamp);

  updateParticles();
  renderParticles();

  requestAnimationFrame(animationLoop);
}

function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

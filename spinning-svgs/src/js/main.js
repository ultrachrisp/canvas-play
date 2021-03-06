import Particle from './particle';
import { createCanvas, loadSvg } from './canvasHelper';

const settings = {
  tag: '.dashboard',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 115" width="75px" height="75px"><defs><style>.cls-1,.cls-2,.cls-3{fill:none;}.cls-1,.cls-2,.cls-3,.cls-4{stroke:%COLOUR%;stroke-miterlimit:10;}.cls-1,.cls-2{stroke-linecap:round;}.cls-2,.cls-3,.cls-4{stroke-width:5px;}.cls-4{fill:#fff;}</style></defs><g><path class="cls-2" d="M33.18,26.1a40,40,0,0,1,54,4.8"/><path class="cls-3" d="M87.15,30.9A40,40,0,0,1,94.23,74"/><circle class="cls-4" cx="94.38" cy="73.73" r="8"/><path class="cls-2" d="M82.38,89.47a40,40,0,0,1-54-4.8"/><path class="cls-3" d="M28.41,84.67a40.09,40.09,0,0,1-7.08-43.15"/><circle class="cls-4" cx="21.18" cy="41.84" r="8"/></g></svg>',
  svgQuery: '%COLOUR%',
  colours: ['#000000', '#73505d', '#312f43', '#5c7364', '#736d5c', '#3a3834']
};

function animateParticles(timestamp){
  window.requestAnimationFrame(animateParticles);
}

function init (){
  const context = createCanvas({ selector: settings.tag });
  loadSvg(settings, context);


  // console.log(img.src);
  // window.requestAnimationFrame(animateParticles);
}

init();

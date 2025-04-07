import GUI from 'lil-gui';
import { GeneralSettings } from '../SpinningSVGs';

export function DebuggingWindow({ settings }: { settings: GeneralSettings }) {
  if (settings.showDebug) {
    const gui = new GUI();
    const colours: string[] = Object.assign({}, settings.colours);

    const svgColour = gui.addFolder("Colours");
    Object.keys(colours).forEach((key) => {
      // svgColour.add(colours, key);
      svgColour.addColor(colours, key, '');
    });

    settings.colours = Object.keys(colours).map(function (key) {
      console.log(colours[key]);
      return colours[key];
    });
  }
}

/**
 * Spinning SVGs is some canvas experiments for chrispyke.com
 *
 * The script will look for an html element with the 'tag' id in settings to empty and initiallize in.
 */

import { SpinningSVGs } from "./src/index.ts";

// setting defaults for the animation
const settings = {
  tag: "#tag",
  svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  svgQuery: "%COLOUR%",
  svgWidth: 10,
  colours: ["#000000"],
};
// run the animation
SpinningSVGs(settings);

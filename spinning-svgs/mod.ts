/**
 * Spinning SVGs is some canvas experiments for chrispyke.com
 *
 * The script will look for an html element with the 'tag' id in settings to empty and initiallize in.
 *
 * @example
 * ```ts
 * import { SpinningSVGs } from "@ultrachrisp/spinning-svgs";
 *
 * const settings = {
 *  tag: "#wrapperElement",
 * svg:'<svg></svg>',
 * svgQuery: "%COLOUR%", // a tag to find and replace in the SVG, so that you can have different colours for the SVG.
 * svgWidth: 50,
 * colours: ["#000000", "#FFFFFF"],
 * };
 *
 * SpinningSVGs({ settings });
 * ```
 */

import { type GeneralSettings, SpinningSVGs } from "./src/SpinningSVGs.ts";

export { type GeneralSettings, SpinningSVGs };

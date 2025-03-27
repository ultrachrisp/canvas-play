# Spinning SVGs

Playful experiment attempting to use SVGs within HTML canvas. Using the SVGs
directly was too computationally expensive, so I copied them across to a
offscreen/ sprite-canvas. I then copy across the needed sprite on each render
cycle.

I attempted to keep my files more functional in style, which allowed me to learn
some things along the way. The code and it's resulting effects aren't perfect,
but good enough for what I was aiming for. Besides, my kids loved playing with
the imperfections, so I left them in.

@example

```ts
import { SpinningSVGs } from "@ultrachrisp/spinning-svgs";

const settings = {
  tag: "#wrapperElement",
  svg: "<svg></svg>",
  svgQuery: "%COLOUR%", // a tag to find and replace in the SVG, so that you can have different colours in the sprite sheet.
  svgWidth: 50,
  colours: ["#000000", "#FFFFFF"],
};

SpinningSVGs({ settings });
```

# Sunny — Rocky Top Reef lip-sync frames

Original Grok Imagine character art for the kids tutor PWA mascot (friendly orange `#FF8200` + white unicorn-fish). No names/text/trademarks in the images. **No commercial license is assured** — generated original art with no third-party brand marks; license status is whatever applies to your Grok Imagine / product terms.

## Recommended drop-ins (Tutor Bot)

| Use | Path | Size |
|-----|------|------|
| Mouth closed (solid blue) | `sunny-mouth-closed.png` | 1024×1024 |
| Mouth half (solid blue) | `sunny-mouth-half.png` | 1024×1024 |
| Mouth open (solid blue) | `sunny-mouth-open.png` | 1024×1024 |
| Horizontal sprite sheet (solid) | `sunny-mouth-spritesheet.png` | 3072×1024 |
| Mouth closed (transparent) | `sunny-mouth-closed-transparent.png` | 1024×1024 |
| Mouth half (transparent) | `sunny-mouth-half-transparent.png` | 1024×1024 |
| Mouth open (transparent) | `sunny-mouth-open-transparent.png` | 1024×1024 |
| Transparent sprite sheet | `sunny-mouth-spritesheet-transparent.png` | 3072×1024 |
| Lighter 512px variants | `*-512.png` | 512 / 1536×512 |

Frame order in every spritesheet (left → right): **closed → half → open**.

## CSS lip-sync (spritesheet)

```css
.sunny-talk {
  width: 256px;
  height: 256px;
  background-image: url("./sunny-mouth-spritesheet-transparent-512.png");
  background-size: 300% 100%; /* 3 frames */
  background-repeat: no-repeat;
  image-rendering: auto;
}
.sunny-talk[data-mouth="closed"] { background-position: 0% 0; }
.sunny-talk[data-mouth="half"]   { background-position: 50% 0; }
.sunny-talk[data-mouth="open"]   { background-position: 100% 0; }

/* simple talk cycle while speech plays */
@keyframes sunny-talk-cycle {
  0%, 100% { background-position: 0% 0; }      /* closed */
  25%      { background-position: 50% 0; }     /* half */
  50%      { background-position: 100% 0; }    /* open */
  75%      { background-position: 50% 0; }     /* half */
}
.sunny-talk.is-talking {
  animation: sunny-talk-cycle 0.28s steps(1) infinite;
}
```

Or flip individual PNGs:

```js
const frames = {
  closed: "sunny-mouth-closed-transparent-512.png",
  half:   "sunny-mouth-half-transparent-512.png",
  open:   "sunny-mouth-open-transparent-512.png",
};
img.src = frames[mouthState]; // "closed" | "half" | "open"
```

Open `demo-lipsync.html` in a browser for a lightweight idle bob + talk cycle.

## Limitations

- Generative frames are close but not pixel-locked; tiny pose/lighting drift between mouth states is normal. Fine for CSS flipbook, not for frame-perfect VFX.
- Transparent PNGs via rembg (u2net); edges may show slight fringe on some reef/blue UIs — prefer solid-blue assets if fringe shows.
- Idle swim loop was **not** generated as video (cost); demo approximates idle with CSS bob on the closed-mouth frame.
- No license warranty; original art, no UT logos / wordmarks / third-party brands in the pixels.

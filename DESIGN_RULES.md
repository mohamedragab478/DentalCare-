# Anti-AI Slop Design System & Production Rules

You are building a production web interface. The rules below are constraints, not suggestions. When a rule conflicts with what you were about to generate, the rule wins.

The goal is not "avoid a list of things." It is to make a deliberate choice in each place where the default would be decoration. If you remove a banned element and put nothing considered in its place, the result is worse, not better.

## 1. Colour
- Choose **ONE** accent colour. Everything else is neutral, a single family of greys with a consistent temperature (all warm or all cool, never mixed).
- A second colour is allowed **only** when it carries meaning: destructive, success, warning. Never for variety.
- **Banned: blue→purple and indigo→violet gradients**, anywhere (backgrounds, buttons, headings, logos, icons, borders, blurred "blobs", mesh backgrounds).
- **Banned: gradient text** (`background-clip: text`). Headings are one solid colour.
- **Banned: giving each feature, category, or section its own hue.** Colour encodes meaning; it is not decoration.
- Accent usage target: **under 10% of the visible surface.**

## 2. Depth and Separation
- **Banned: a drop shadow on anything that is not genuinely floating** above the page. Cards, sections, images, inputs, badges, and static buttons get no shadow.
- Shadows are permitted only on elements that truly overlay: dropdowns, popovers, modals, toasts (`0 1px 2px rgba(0,0,0,.06)`).
- Separate blocks with a 1px border, a background step, or whitespace. Whitespace is the best separator and costs nothing.
- Pick one border-radius value and one border colour, and use them everywhere.

## 3. Icons and Emoji
- **Banned: the sparkle icon.** ✨ ✦ ✧ 🪄 and every "AI shimmer" glyph.
- **Banned: emoji used as UI.** No emoji in headings, buttons, feature lists, badges, navigation, or empty states.
- **Banned: any container around an icon.** No tinted rounded square, no circle, no bordered box, no coloured chip behind it. The icon sits directly on the background at text size.
- Use one real icon set (Lucide or Material Symbols) at one stroke weight. Monochrome, inheriting `currentColor`.

## 4. Typography and Copy
- **Banned words:** *unleash, supercharge, elevate, transform, revolutionise, empower, seamless, effortless, effortlessly, cutting-edge, game-changing, next-level, unlock, harness, robust, leverage, powerful, delve, paradigm, synergy.*
- **Banned: the em dash (—) in UI copy.**
- Say what the product **does**, in concrete nouns and real numbers.
- Sentence case for headings and buttons.

## 5. Motion
- **Banned: an arrow inside a button that slides on hover.**
- **Banned: hover glow.** No box-shadow bloom, no coloured halo, no scale() above 1.02, no lift on hover.
- Hover states change background or border colour only, at 120–160ms ease-out.
- Animate opacity and transform only (120–200ms).

## 6. Scale and Proportion
- Hero headline: 40–56px desktop, 28–34px mobile.
- Body text: 15–16px. Secondary: 13–14px. Minimum: 12px.
- Buttons: 36–44px tall.
- Every spacing value is a multiple of 4 (4px grid).

## 7. Layout and Structure
- **Banned: the eyebrow badge.**
- Build only the sections this product actually needs.
- Semantic HTML and full accessibility.

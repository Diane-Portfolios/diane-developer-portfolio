// Shared geometry for the console on the homepage. Everything that has to
// line up with it derives from these values rather than re-deriving its own,
// so the pieces cannot drift apart.

// Measured off the source PNG (812x1046) by scanning for the dark LCD panel:
// bbox x 167..636, y 127..549. Its centre lands at 49.45% / 32.31% of the image
// — noticeably above the image's own midpoint, since the console's body extends
// much further below the screen than above it.
export const SCREEN_CENTRE_X = 49.45
export const SCREEN_CENTRE_Y = 32.31

export const CONSOLE_ASPECT = 812 / 1046

// Console height. Below lg (1024px) the hero is a single column — the
// console is the only thing in it, centred on the full viewport — so this is
// the same min(73vh, 122vw) it always was: 122vw is the narrow-viewport
// limit that keeps the console from overflowing a phone.
//
// At lg and up the hero becomes a 2-column layout (see page.tsx): About +
// the work-location note stacked on the left, the console centred in its
// own column on the right. There the console only has roughly half the
// viewport's width to work with, not all of it, and at 73vh tall it dwarfed
// a text column beside it rather than balancing it — --console-max-w and
// --console-max-h carry both narrower limits in from a breakpoint-only media
// query in globals.css (a plain CSS custom property can't express "a
// different value above a breakpoint" any other way — Tailwind's responsive
// prefixes only apply to classes, not to values fed into a JS-computed
// inline style like this one).
export const SIZE = 'min(var(--console-max-h, 73vh), var(--console-max-w, 122vw))'

// Distance from the bottom of the viewport up to where the console ends.
// SCREEN_CENTRE_Y% of its height sits above the vertical centre line, so the
// remaining (100 - SCREEN_CENTRE_Y)% hangs below it. The background photo
// stops here (see page.tsx) so the console's base rests on solid black
// rather than the photo running all the way to the bottom of the hero.
export const CONSOLE_BOTTOM_INSET = `calc(50vh - ${(
  (100 - SCREEN_CENTRE_Y) / 100
).toFixed(4)} * ${SIZE})`

// How far to nudge the console down from a plain geometric centring so the
// *screen* — not the image's own midpoint — lands at the centre of whatever
// box centres it (the hero's grid cell). The screen sits SCREEN_CENTRE_Y%
// down from the image's top, noticeably above its own 50% mark, so centring
// the box by its geometry alone would leave the screen looking too high.
export const SCREEN_Y_OFFSET = (50 - SCREEN_CENTRE_Y).toFixed(4)

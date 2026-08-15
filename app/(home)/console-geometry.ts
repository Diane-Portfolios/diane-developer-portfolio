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

// The console is 812/1046 ≈ 0.776 wide-to-tall. With the screen centre pinned to
// the viewport centre, the taller half is the 67.69% below it, so the whole
// console stays on screen while that half fits in 50vh — i.e. up to ~73vh. The
// 122vw term is the same limit for narrow viewports, so the console shrinks
// rather than overflowing on a phone.
export const SIZE = 'min(73vh, 122vw)'

// Distance from the bottom of the viewport up to where the console ends.
// SCREEN_CENTRE_Y% of its height sits above the 50vh centre line, so the
// remaining (100 - SCREEN_CENTRE_Y)% hangs below it.
export const CONSOLE_BOTTOM_INSET = `calc(50vh - ${(
  (100 - SCREEN_CENTRE_Y) / 100
).toFixed(4)} * ${SIZE})`

// Distance from the *right* edge of the viewport to the console's left edge.
// The console's width is CONSOLE_ASPECT x SIZE and SCREEN_CENTRE_X% of that
// width lies left of the 50vw centre line, so its left edge is that far out.
const HALF_LEFT = ((SCREEN_CENTRE_X / 100) * CONSOLE_ASPECT).toFixed(4)
export const CONSOLE_LEFT_FROM_RIGHT = `calc(50vw + ${HALF_LEFT} * ${SIZE})`

// Mirror of the above: distance from the *left* edge of the viewport to the
// console's right edge. The screen centre isn't quite the console's midline
// (49.45%, not 50%), so this is not the same number as HALF_LEFT.
const HALF_RIGHT = (((100 - SCREEN_CENTRE_X) / 100) * CONSOLE_ASPECT).toFixed(4)
export const CONSOLE_RIGHT_FROM_LEFT = `calc(50vw + ${HALF_RIGHT} * ${SIZE})`

// Usable width of the columns either side of the console, i.e. viewport edge to
// console edge less the gap. Both depend on SIZE, which is itself
// min(73vh, 122vw) — so these narrow as the viewport gets *taller*, not just as
// it gets narrower. Sizing the side text off these rather than off breakpoints
// is what keeps it from overflowing at awkward window shapes.
//
// Consumers divide these by the width of their longest string in em to get a
// font size that provably fits. Both reference var(--ns-side-gap), which the
// consuming component sets.
export const LEFT_COLUMN = `calc(50vw - ${HALF_LEFT} * ${SIZE} - var(--ns-side-gap))`
export const RIGHT_COLUMN = `calc(50vw - ${HALF_RIGHT} * ${SIZE} - var(--ns-side-gap))`

// Side text is hidden outside this: below 1024px there's no column at all, and
// at aspect ratios taller than 4/3 the console grows off 73vh and squeezes the
// columns to nothing. At exactly 4/3 the fit still holds at every size.
export const SIDE_TEXT_VISIBLE =
  '[@media(min-width:1024px)_and_(min-aspect-ratio:4/3)]:block'

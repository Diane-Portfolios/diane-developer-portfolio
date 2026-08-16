'use client'

import { useGameBoyControls } from './language-context'

// D-pad and B-button hit regions, measured off the source PNG (812x1046) the
// same way console-geometry.ts's SCREEN_CENTRE_X/Y were: scanning for dark
// pixels (the buttons) against the purple shell, below the "Nintendo"
// wordmark to exclude the screen bezel. Raw measured bounding boxes:
//   D-pad (whole cross): x 65-268, y 818-1020
//   B button:             x 494-595, y 891-993
// Each is padded outward by ~10-15px before being carved up, so the hit
// targets are a little more generous than the printed artwork rather than
// pixel-clipped to it. The D-pad's padded box is then split into a 3x3 grid
// — the 4 edge cells become up/down/left/right, corners and centre dead —
// which lines up with the cross shape since its arms already sit in those
// edge thirds. No A button/region: per the interaction design, the D-pad
// alone drives the language, live.
const DPAD = { left: 53, top: 806, width: 227, height: 226 } // padded bbox, px
const DPAD_COL = DPAD.width / 3
const DPAD_ROW = DPAD.height / 3

const pct = (px: number, of: number) => `${((px / of) * 100).toFixed(2)}%`

const BUTTONS: {
  key: 'up' | 'down' | 'left' | 'right' | 'b'
  label: string
  rect: { left: string; top: string; width: string; height: string }
}[] = [
  {
    key: 'up',
    label: 'Move language selection up',
    rect: {
      left: pct(DPAD.left + DPAD_COL, 812),
      top: pct(DPAD.top, 1046),
      width: pct(DPAD_COL, 812),
      height: pct(DPAD_ROW, 1046),
    },
  },
  {
    key: 'down',
    label: 'Move language selection down',
    rect: {
      left: pct(DPAD.left + DPAD_COL, 812),
      top: pct(DPAD.top + DPAD_ROW * 2, 1046),
      width: pct(DPAD_COL, 812),
      height: pct(DPAD_ROW, 1046),
    },
  },
  {
    key: 'left',
    label: 'Move language selection left',
    rect: {
      left: pct(DPAD.left, 812),
      top: pct(DPAD.top + DPAD_ROW, 1046),
      width: pct(DPAD_COL, 812),
      height: pct(DPAD_ROW, 1046),
    },
  },
  {
    key: 'right',
    label: 'Move language selection right',
    rect: {
      left: pct(DPAD.left + DPAD_COL * 2, 812),
      top: pct(DPAD.top + DPAD_ROW, 1046),
      width: pct(DPAD_COL, 812),
      height: pct(DPAD_ROW, 1046),
    },
  },
  {
    key: 'b',
    label: 'Reset language to English',
    // B button, padded bbox: x 484-605, y 881-1003.
    rect: { left: pct(484, 812), top: pct(881, 1046), width: pct(121, 812), height: pct(122, 1046) },
  },
]

// Soft halos behind the D-pad and B button, so it reads as "press me"
// rather than looking like an ordinary static photo of a console. One glow
// per physical button rather than one per hit-region — four small glows
// stitched around the cross would look like separate lights instead of one
// button. Circles centred on each button's own bbox (see BUTTONS' comment),
// sized a bit past it so the blur has room to bleed outward: radius is
// roughly the button's own half-width plus a few px of bloom — tight enough
// that it reads as a highlight on the button rather than a wash over the
// whole corner of the console.
const GLOWS: { key: 'dpad' | 'b'; rect: { left: string; top: string; width: string; height: string } }[] = [
  {
    key: 'dpad',
    // Centred on the padded D-pad bbox (166.5, 919), radius 105.
    rect: { left: pct(61.5, 812), top: pct(814, 1046), width: pct(210, 812), height: pct(210, 1046) },
  },
  {
    key: 'b',
    // Centred on the padded B bbox (544.5, 942), radius 62.
    rect: { left: pct(482.5, 812), top: pct(880, 1046), width: pct(124, 812), height: pct(124, 1046) },
  },
]

// Low peak alpha and an early falloff — a hint of light rather than a wash.
const GLOW_GRADIENT =
  'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 65%)'

// Clickable overlay for the D-pad and B button printed on the console
// artwork (see page.tsx — sits alongside GameBoyScreen in the same
// percentage coordinate space as the console Image). Disabled until the
// boot sequence hands off to the menu (see GameBoyScreen's
// setControlsEnabled call) so a press during the intro video can't silently
// change the site's language with nothing on screen to explain why.
export function GameBoyControls() {
  const { move, reset, controlsEnabled } = useGameBoyControls()

  return (
    <>
      {/* Decorative — the glow only signals that the buttons underneath are
          live, it carries no information of its own, so it's aria-hidden
          and non-interactive. Fades in with the buttons becoming enabled
          (outer div) and pulses gently once visible (inner div) — split
          across two elements because a CSS animation and a React-driven
          opacity transition fighting over the same property on one element
          would fight each other. */}
      {GLOWS.map(({ key, rect }) => (
        <div
          key={key}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full transition-opacity duration-700"
          style={{ ...rect, opacity: controlsEnabled ? 1 : 0 }}
        >
          <div className="ns-controls-glow h-full w-full rounded-full" style={{ background: GLOW_GRADIENT }} />
        </div>
      ))}

      {BUTTONS.map(({ key, label, rect }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          disabled={!controlsEnabled}
          onClick={() => (key === 'b' ? reset() : move(key))}
          className="absolute rounded-full transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 enabled:active:scale-90 disabled:pointer-events-none"
          style={rect}
        />
      ))}
    </>
  )
}

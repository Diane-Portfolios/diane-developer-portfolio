// One clock for every rotating string on the page. The navbar role and the work
// location both read their timing from here, so whatever language one is
// showing, the other is showing too — they can't drift because there is only one
// sequence and one duration.

// Rotation order, as originally specified for the navbar.
export const LANG_ORDER = [
  'fr',
  'ja',
  'de',
  'ko',
  'es',
  'zh-Hans',
  'pt',
  'cs',
  'it',
]

// How long each entry is on screen, and how long it takes to cross into the
// next. HOLD is the fully-opaque part, so an entry is legible for SLOT - FADE.
export const FADE_MS = 800
export const SLOT_MS = 3800

// Two languages then English, repeated. For every language to appear the same
// number of times, the loop needs 2n language slots where 2n is a multiple of
// nine — so nine groups of three, giving each language exactly two turns and
// English nine. That's the shortest loop that stays even.
export const SEQUENCE: string[] = (() => {
  const out: string[] = []
  let lang = 0
  for (let group = 0; group < LANG_ORDER.length; group++) {
    out.push(LANG_ORDER[lang++ % LANG_ORDER.length])
    out.push(LANG_ORDER[lang++ % LANG_ORDER.length])
    out.push('en')
  }
  return out
})()

export const SLOT_COUNT = SEQUENCE.length
export const TOTAL_MS = SLOT_COUNT * SLOT_MS

export const slotsFor = (code: string) =>
  SEQUENCE.reduce<number[]>((acc, c, i) => (c === code ? [...acc, i] : acc), [])

// Slots where the Czech declension of the place names applies.
export const CZECH_SLOTS = slotsFor('cs')

/**
 * Builds one @keyframes rule that keeps an element visible for exactly the
 * slots given and hidden for the rest, crossing over FADE_MS at each boundary.
 *
 * Keypoints are only emitted where the value actually changes. That matters for
 * elements visible across consecutive slots — the place names sit at opacity 1
 * for 25 slots straight — because fading them out and back in at every slot
 * boundary would make identical text visibly pulse.
 */
function keyframes(
  name: string,
  visible: Set<number>,
  // 'fade' crosses over FADE_MS; 'snap' switches instantly, halfway through
  // that window. Text dissolves; the menu cursor snaps, the way a real console
  // cursor does — and snapping also guarantees only ever one arrow on screen,
  // where a crossfade would briefly show two.
  mode: 'fade' | 'snap' = 'fade'
): string {
  const pts = new Map<string, number>()
  const at = (ms: number, opacity: number) =>
    pts.set((((ms / TOTAL_MS) * 100).toFixed(4)), opacity)

  // A step needs two keypoints a hair apart; 20ms is imperceptible but stays
  // distinct once percentages are rounded.
  const STEP_MS = 20

  // The value carried into slot 0 is whatever slot N-1 ended on, and the loop
  // has to start and end on it or the wrap would jump.
  const edge = visible.has(SLOT_COUNT - 1) ? 1 : 0
  at(0, edge)
  at(TOTAL_MS, edge)

  for (let i = 0; i < SLOT_COUNT; i++) {
    const cur = visible.has(i) ? 1 : 0
    const prev = visible.has((i - 1 + SLOT_COUNT) % SLOT_COUNT) ? 1 : 0
    if (cur === prev) continue
    if (mode === 'snap') {
      // Centred in the dissolve so the jump reads as part of the same beat.
      const t = i * SLOT_MS + FADE_MS / 2
      at(t, prev)
      at(t + STEP_MS, cur)
    } else {
      at(i * SLOT_MS, prev)
      at(i * SLOT_MS + FADE_MS, cur)
    }
  }

  const body = [...pts.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([pct, o]) => `${pct}%{opacity:${o}}`)
    .join('')

  return `@keyframes ${name}{${body}}`
}

export const rotationName = (code: string) => `ns-rot-${code.replace('-', '')}`

// Name for the element that shows whenever Czech is *not* on screen — the
// English place names.
export const NON_CZECH_NAME = 'ns-rot-places'

// Menu-cursor variant: same slots, hard switch. There's no rule for English —
// it has no row on the menu, so during those slots every cursor is hidden and
// the arrow is simply off screen.
export const cursorName = (code: string) => `ns-cur-${code.replace('-', '')}`

// All the rules, emitted once into the page.
export const ROTATION_CSS = [
  ...[...new Set(SEQUENCE)].map((code) =>
    keyframes(rotationName(code), new Set(slotsFor(code)))
  ),
  ...LANG_ORDER.map((code) =>
    keyframes(cursorName(code), new Set(slotsFor(code)), 'snap')
  ),
  keyframes(
    NON_CZECH_NAME,
    new Set(
      Array.from({ length: SLOT_COUNT }, (_, i) => i).filter(
        (i) => !CZECH_SLOTS.includes(i)
      )
    )
  ),
].join('')

// Applied to every rotating element; only the keyframe name differs.
export const rotationStyle = (code: string) => ({
  animationName: rotationName(code),
  animationDuration: `${TOTAL_MS}ms`,
})

export const cursorStyle = (code: string) => ({
  animationName: cursorName(code),
  animationDuration: `${TOTAL_MS}ms`,
})

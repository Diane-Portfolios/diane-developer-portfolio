import { FINAL_FADE_MS, TOTAL_DURATION_MS } from './cycle-phrases'
import {
  CONSOLE_LEFT_FROM_RIGHT,
  LEFT_COLUMN,
  SIDE_TEXT_VISIBLE,
} from './console-geometry'

// PLACEHOLDER TRANSLATION — not native-reviewed, same as the navbar phrases.
// ワシントン州シアトル = "Seattle, Washington State"
// から働いています     = "...work from"
const JA_PLACE = 'ワシントン州シアトル'
const JA_REST = 'から働いています'

const EN_REST = 'Based in'
const EN_PLACE = 'Seattle, WA'

// The Japanese place name governs the fit — it renders far wider than the
// English (4.8em). Measured on the live element at 9.67em: an isolated probe
// span reports only 9.169em, because this element carries lang="ja" and the
// browser therefore picks a different, wider CJK fallback face. Dividing the
// column by 10.4 gives the real 9.67em about 7% headroom.
//
// The text is nowrap, so max-width cannot rescue an overflow — the font size
// has to be right in the first place.
const PLACE_FONT = `min(3rem, calc(${LEFT_COLUMN} / 10.4))`
// Supporting line: 7.536em at most, and always smaller than the place name.
const REST_FONT = `min(1.125rem, calc(${LEFT_COLUMN} / 16))`

// Sits left of the console and swaps from Japanese to English on the same clock
// as the navbar title, so the two land on English together.
export function LocationNote() {
  const cycleWindow = TOTAL_DURATION_MS - FINAL_FADE_MS

  return (
    <div
      // --ns-side-gap is the clearance from the console; it feeds the calc()s
      // above as well as the offset below, so it has to be a custom property
      // rather than a Tailwind spacing class.
      className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 [--ns-side-gap:3rem] xl:[--ns-side-gap:4rem] 2xl:[--ns-side-gap:5rem] ${SIDE_TEXT_VISIBLE}`}
      style={{
        top: '50%',
        right: `calc(${CONSOLE_LEFT_FROM_RIGHT} + var(--ns-side-gap))`,
      }}
    >
      {/* Both states share one grid cell, so the block is as wide as the wider
          of the two and the right edge never shifts during the swap. */}
      <div
        className="ns-cycle-stack text-right"
        style={{ ['--ns-stack-align' as string]: 'end' }}
      >
        {/* English is the settled, accessible state. */}
        <div
          className="ns-cycle-final"
          style={{
            animationDelay: `${cycleWindow}ms`,
            animationDuration: `${FINAL_FADE_MS}ms`,
          }}
        >
          <p className="text-neutral-300" style={{ fontSize: REST_FONT }}>
            {EN_REST}
          </p>
          <p
            className="font-semibold tracking-tight text-white"
            style={{ fontSize: PLACE_FONT }}
          >
            {EN_PLACE}
          </p>
        </div>

        {/* Japanese leads. Note the order is reversed against the English: the
            place name precedes the particle, so the large line lands on top. */}
        <div
          aria-hidden="true"
          lang="ja"
          // ns-cycle-out, not ns-cycle-slot: it's up from the first frame and
          // fades out across the handoff, dissolving into the English beneath
          // rather than hard-cutting away from it.
          className="ns-cycle-out"
          style={{
            animationDelay: `${cycleWindow}ms`,
            animationDuration: `${FINAL_FADE_MS}ms`,
          }}
        >
          <p
            className="font-semibold tracking-tight text-white"
            style={{ fontSize: PLACE_FONT }}
          >
            {JA_PLACE}
          </p>
          <p className="text-neutral-300" style={{ fontSize: REST_FONT }}>
            {JA_REST}
          </p>
        </div>
      </div>
    </div>
  )
}

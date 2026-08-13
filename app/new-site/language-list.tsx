import { FINAL_FADE_MS, TOTAL_DURATION_MS } from './cycle-phrases'
import {
  CONSOLE_RIGHT_FROM_LEFT,
  RIGHT_COLUMN,
  SIDE_TEXT_VISIBLE,
} from './console-geometry'

// PLACEHOLDER TRANSLATION — not native-reviewed, same as the others.
// 言語 = "language(s)". Japanese doesn't mark plural, so it covers both.
const JA_HEADING = '言語'
const EN_HEADING = 'Languages'

// Each language written in itself. Casing follows each language's own
// convention rather than being forced to title case: only German capitalises
// its language name, so the rest are correctly lowercase. Say the word if
// you'd rather they all read as Title Case for visual evenness.
const LANGUAGES = [
  { name: 'español', lang: 'es' },
  { name: 'français', lang: 'fr' },
  { name: 'português', lang: 'pt' },
  { name: 'italiano', lang: 'it' },
  { name: 'Deutsch', lang: 'de' },
  { name: 'čeština', lang: 'cs' },
  { name: '日本語', lang: 'ja' },
  { name: '简体中文', lang: 'zh-Hans' },
  { name: '한국어', lang: 'ko' },
]

// Sized off the available column so nothing can run off the right edge, same
// approach as the location note. The heading now outranks the list, and both
// are smaller than the previous pass.
const HEADING_FONT = `min(1.75rem, calc(${RIGHT_COLUMN} / 6))`
const ITEM_FONT = `min(1.125rem, calc(${RIGHT_COLUMN} / 9))`

// Mirrors LocationNote on the other side of the console, and shares its clock:
// the Japanese heading is up from the first frame alongside the Japanese on the
// left, and both dissolve into English exactly as the list appears.
export function LanguageList() {
  const cycleWindow = TOTAL_DURATION_MS - FINAL_FADE_MS
  const swap = {
    animationDelay: `${cycleWindow}ms`,
    animationDuration: `${FINAL_FADE_MS}ms`,
  }

  return (
    <div
      className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 [--ns-side-gap:3rem] xl:[--ns-side-gap:4rem] 2xl:[--ns-side-gap:5rem] ${SIDE_TEXT_VISIBLE}`}
      style={{
        top: '50%',
        left: `calc(${CONSOLE_RIGHT_FROM_LEFT} + var(--ns-side-gap))`,
      }}
    >
      {/* Heading swaps 言語 -> Languages. Both states share one grid cell so the
          block doesn't resize under them mid-dissolve. */}
      <div
        className="ns-cycle-stack font-semibold tracking-tight text-white"
        style={{ fontSize: HEADING_FONT }}
      >
        <span className="ns-cycle-final" style={swap}>
          {EN_HEADING}
        </span>
        <span className="ns-cycle-out" aria-hidden="true" lang="ja" style={swap}>
          {JA_HEADING}
        </span>
      </div>

      {/* Same delay and duration as the swap, so the list resolves in on
          exactly the same frame the headings cross. */}
      <ul
        className="ns-cycle-final mt-3 list-disc space-y-1 pl-5 text-neutral-200 marker:text-neutral-500"
        style={{ fontSize: ITEM_FONT, ...swap }}
      >
        {LANGUAGES.map(({ name, lang }) => (
          <li key={lang} lang={lang}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

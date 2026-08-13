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

// `en` shows first; `native` replaces it at the swap. Casing on the native side
// follows each language's own convention rather than being forced to title
// case: only German capitalises its language name, so the rest are correctly
// lowercase. Say the word if you'd rather they all read as Title Case.
const LANGUAGES = [
  { en: 'Spanish', native: 'español', lang: 'es' },
  { en: 'French', native: 'français', lang: 'fr' },
  { en: 'Portuguese', native: 'português', lang: 'pt' },
  { en: 'Italian', native: 'italiano', lang: 'it' },
  { en: 'German', native: 'Deutsch', lang: 'de' },
  { en: 'Czech', native: 'čeština', lang: 'cs' },
  { en: 'Japanese', native: '日本語', lang: 'ja' },
  { en: 'Simplified Chinese', native: '简体中文', lang: 'zh-Hans' },
  { en: 'Korean', native: '한국어', lang: 'ko' },
]

// Sized off the available column so nothing can run off the right edge, same
// approach as the location note. The English list is the wider of the two
// states — measured at 8.26em including the bullet indent, driven by
// "Simplified Chinese" — so /10 clears it with room to spare. In practice the
// 1.125rem cap binds at every viewport that shows this block; the divisor is
// the backstop. The heading outranks the list.
const HEADING_FONT = `min(1.75rem, calc(${RIGHT_COLUMN} / 6))`
const ITEM_FONT = `min(1.125rem, calc(${RIGHT_COLUMN} / 10))`

const LIST_CLASS = 'list-disc space-y-1 pl-5 marker:text-neutral-500'

// Mirrors LocationNote on the other side of the console and shares its clock.
// Both are up from the first frame; at the swap the heading dissolves from
// Japanese into English while the list dissolves the other way, from English
// into each language's own name.
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
      {/* 言語 -> Languages. Both states share one grid cell so the block can't
          resize under them mid-dissolve. */}
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

      {/* English -> native, on the same frames. Two full lists sharing one cell:
          both have nine rows at one size, so they line up row for row and the
          dissolve reads as each name changing in place. */}
      <div
        className="ns-cycle-stack mt-3 text-neutral-200"
        style={{ fontSize: ITEM_FONT }}
      >
        {/* The native names are the settled, accessible state. */}
        <ul className={`ns-cycle-final ${LIST_CLASS}`} style={swap}>
          {LANGUAGES.map(({ native, lang }) => (
            <li key={lang} lang={lang}>
              {native}
            </li>
          ))}
        </ul>

        <ul className={`ns-cycle-out ${LIST_CLASS}`} aria-hidden="true" style={swap}>
          {LANGUAGES.map(({ en, lang }) => (
            <li key={lang}>{en}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

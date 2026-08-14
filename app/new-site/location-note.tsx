import {
  CONSOLE_RIGHT_FROM_LEFT,
  RIGHT_COLUMN,
  SIDE_TEXT_VISIBLE,
} from './console-geometry'
import {
  NON_CZECH_NAME,
  SEQUENCE,
  TOTAL_MS,
  rotationStyle,
} from './rotation'

// Static for every language except Czech, which declines them (see below).
const PLACES = ['Seattle, WA', 'Chicago, IL']

// Czech puts these in the locative case after "v", so the place names
// themselves change: Seattle -> Seattlu, Chicago -> Chicagu. The preposition
// rides along here rather than on the label, which leaves the label as the bare
// verb. This is the only point in the rotation where the place lines are not
// the plain English ones.
const CZECH_PLACES = ['v Seattlu', 'v Chicagu']

// PLACEHOLDER TRANSLATIONS — not native-reviewed.
//
// The three CJK entries are noun labels ("work location" / "workplace") rather
// than literal renderings of "I work in". Japanese and Korean put their
// particle after the place and Chinese wraps it (我在…工作), so a word-for-word
// version would strand a fragment above the city names — and with two cities it
// would have to wrap both. The label form is what those languages actually use
// for this pattern and it sits cleanly above the list.
const LABEL_BY_LANG: Record<string, string> = {
  en: 'I work in',
  fr: 'Je travaille à',
  ja: '勤務地',
  de: 'Ich arbeite in',
  ko: '근무지',
  es: 'Trabajo en',
  'zh-Hans': '工作地点',
  pt: 'Trabalho em',
  cs: 'Pracuji',
  it: 'Lavoro a',
}

// Sized off the available column so nothing runs off the right edge. The place
// names govern: they're the largest text and set the block's width.
const PLACE_FONT = `min(3rem, calc(${RIGHT_COLUMN} / 5.4))`
const LABEL_FONT = `min(1.375rem, calc(${RIGHT_COLUMN} / 13))`

// Sits right of the console. The label rotates on the same clock as the navbar
// role, so the two always show the same language; the place names hold still
// throughout, apart from the Czech slots.
export function LocationNote() {
  const codes = [...new Set(SEQUENCE)]

  return (
    <div
      // --ns-side-gap is the clearance from the console; it feeds the calc()s
      // above as well as the offset below, so it has to be a custom property
      // rather than a Tailwind spacing class.
      className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 [--ns-side-gap:3rem] xl:[--ns-side-gap:4rem] 2xl:[--ns-side-gap:5rem] ${SIDE_TEXT_VISIBLE}`}
      style={{
        top: '50%',
        left: `calc(${CONSOLE_RIGHT_FROM_LEFT} + var(--ns-side-gap))`,
      }}
    >
      {/* All label states share one grid cell, so the lines below can't be
          nudged as they cross. */}
      <div
        className="ns-cycle-stack text-neutral-300"
        style={{ fontSize: LABEL_FONT }}
      >
        {codes.map((code) => (
          <span
            key={code}
            className={code === 'en' ? 'ns-rot-default' : 'ns-rot'}
            aria-hidden={code === 'en' ? undefined : 'true'}
            lang={code === 'en' ? undefined : code}
            style={rotationStyle(code)}
          >
            {LABEL_BY_LANG[code]}
          </span>
        ))}
      </div>

      {/* Both place states share one cell so the block keeps one width and the
          lines stay on the same baselines through the Czech substitution. */}
      <div
        className="ns-cycle-stack font-semibold tracking-tight text-white"
        style={{ fontSize: PLACE_FONT }}
      >
        {/* Visible for every slot that isn't Czech. Its keyframes hold opacity
            at 1 straight through consecutive slots rather than fading at each
            boundary — otherwise identical text would pulse every few seconds. */}
        <div
          className="ns-rot-default"
          style={{
            animationName: NON_CZECH_NAME,
            animationDuration: `${TOTAL_MS}ms`,
          }}
        >
          {PLACES.map((place) => (
            <p key={place}>{place}</p>
          ))}
        </div>

        <div
          aria-hidden="true"
          lang="cs"
          className="ns-rot"
          style={rotationStyle('cs')}
        >
          {CZECH_PLACES.map((place) => (
            <p key={place}>{place}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

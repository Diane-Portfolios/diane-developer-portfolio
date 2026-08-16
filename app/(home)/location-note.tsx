'use client'

import { useLanguage } from './language-context'

// Static for every language except Czech, which declines them (see below).
const PLACES = ['Seattle, WA', 'Chicago, IL']

// Czech puts these in the locative case after "v", so the place names
// themselves change: Seattle -> Seattlu, Chicago -> Chicagu. The preposition
// rides along here rather than on the label, which leaves the label as the bare
// verb.
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

// Bottom half of the hero's left column (see page.tsx), stacked below
// AboutNote. The label shows whatever language the Game Boy's D-pad
// currently has selected, same as the navbar role, so the two always match;
// the place names hold still except for the Czech declension.
export function LocationNote() {
  const { language } = useLanguage()
  const places = language === 'cs' ? CZECH_PLACES : PLACES

  return (
    <div className="ns-enter-side text-left" style={{ animationDelay: '0.7s' }}>
      <div className="text-lg text-neutral-300" lang={language === 'en' ? undefined : language}>
        {LABEL_BY_LANG[language]}
      </div>

      <div className="text-4xl font-semibold tracking-tight text-white" lang={language === 'cs' ? 'cs' : undefined}>
        {places.map((place) => (
          <p key={place}>{place}</p>
        ))}
      </div>
    </div>
  )
}

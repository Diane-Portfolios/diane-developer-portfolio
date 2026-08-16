'use client'

import { ROLE_BY_LANG, TITLE_PREFIX } from './cycle-phrases'
import { useLanguage } from './language-context'

// Holds TITLE_PREFIX in English while the role beneath it shows whatever
// language the Game Boy's D-pad currently has selected (see
// ./language-context) — no rotation, no timer, just the current language.
export function CyclingTitle({ className = '' }: { className?: string }) {
  const { language } = useLanguage()

  return (
    // Stacked at every breakpoint — the role sits on its own line under the
    // name, so a long phrase in any language has the nav's full width to run
    // instead of risking an overflow/clip, and the two lines can carry
    // distinct weights without a shared baseline forcing them together.
    <span className={`flex flex-col items-start whitespace-normal ${className}`}>
      {/* font-bold is explicit here (not inherited from nav's className) so
          the name stays bold regardless of what weight the role below ends
          up at. */}
      <span className="font-bold text-white">{TITLE_PREFIX}</span>

      {/* font-normal is explicit so the role reads distinctly lighter than
          the bold name above it, whatever weight nav.tsx's className sets. */}
      <span
        className="font-normal text-neutral-300"
        lang={language === 'en' ? undefined : language}
        dir="auto"
      >
        {ROLE_BY_LANG[language]}
      </span>
    </span>
  )
}

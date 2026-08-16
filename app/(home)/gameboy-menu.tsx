'use client'

import { useLanguage } from './language-context'
import { LANGUAGES } from './languages'
import { pixelFont } from './pixel-font'

// A Game Boy-styled language-select screen. The cursor row tracks whatever
// language is currently selected (see ./language-context) — driven by the
// console's D-pad, not decorative.
//
// Sizes are in cqh/cqw (percentages of the screen element), so the whole menu
// scales with the console instead of needing its own breakpoints. The parent
// sets container-type: size for these to resolve against.
//
// White and black are taken from the clip's own logo frame so the switch from
// video to menu doesn't shift the background.
export function GameBoyMenu() {
  const { language } = useLanguage()

  return (
    <div
      className={`${pixelFont.className} absolute inset-0 flex flex-col bg-white text-black`}
      style={{ padding: '5cqh 4cqw' }}
    >
      <p
        className="shrink-0 border-b-[0.6cqh] border-black pb-[2cqh] text-center"
        style={{ fontSize: '5.4cqh', letterSpacing: '0.05em' }}
      >
        LANGUAGE
      </p>

      {/* 2 columns now that English gives the list a 10th row — a single
          column of 10 no longer fit the screen's height. grid-auto-flow:
          column with 5 explicit rows fills top-to-bottom then wraps to the
          next column, rather than needing the source array pre-split, so
          English (first in LANGUAGES) lands top-left and reading order still
          matches the array. */}
      <ul
        className="mt-[2.5cqh] grid flex-1 gap-x-[4cqw] gap-y-[1.5cqh]"
        style={{
          fontSize: '4cqh',
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(5, 1fr)',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {LANGUAGES.map(({ native, lang }) => (
          <li key={lang} className="flex items-center gap-[2cqw]">
            {/* Cursor drawn with borders rather than a ▶ glyph: the pixel face
                has no arrow, so a character would fall back to a smooth system
                one. A CSS triangle stays hard-edged at any scale.
                Rendered on every row so the rows stay aligned regardless of
                which one is active — an absent element would shift the
                indent — with opacity toggled by whether this row's language
                is the one currently selected. */}
            <span
              aria-hidden="true"
              className="shrink-0"
              style={{
                opacity: lang === language ? 1 : 0,
                width: 0,
                height: 0,
                borderTop: '1.7cqh solid transparent',
                borderBottom: '1.7cqh solid transparent',
                borderLeft: '2.3cqh solid currentColor',
              }}
            />
            <span lang={lang === 'en' ? undefined : lang}>{native}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { LANGUAGES } from './languages'
import { cursorStyle } from './rotation'
import { pixelFont } from './pixel-font'

// A fake language-select screen, styled after a Game Boy menu. Nothing is
// interactive yet — the cursor is decorative and no item is selectable.
//
// Sizes are in cqh/cqw (percentages of the screen element), so the whole menu
// scales with the console instead of needing its own breakpoints. The parent
// sets container-type: size for these to resolve against.
//
// White and black are taken from the clip's own logo frame so the switch from
// video to menu doesn't shift the background.
export function GameBoyMenu() {
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

      <ul
        className="mt-[2.5cqh] flex flex-1 flex-col justify-between"
        style={{ fontSize: '5.4cqh' }}
      >
        {LANGUAGES.map(({ native, lang }) => (
          <li key={lang} className="flex items-center gap-[2cqw]">
            {/* Cursor drawn with borders rather than a ▶ glyph: the pixel face
                has no arrow, so a character would fall back to a smooth system
                one. A CSS triangle stays hard-edged at any scale.
                Rendered on every row so the rows stay aligned regardless of
                which one is active — an absent element would shift the indent.

                Each row's arrow is driven by the same rotation clock as the
                text, keyed to its own language, so it lands on whichever
                language is currently being shown. English has no row here, so
                during those slots every arrow is hidden and the cursor is
                simply off screen. */}
            <span
              aria-hidden="true"
              className="ns-rot shrink-0"
              style={{
                ...cursorStyle(lang),
                width: 0,
                height: 0,
                borderTop: '2.2cqh solid transparent',
                borderBottom: '2.2cqh solid transparent',
                borderLeft: '3cqh solid currentColor',
              }}
            />
            <span lang={lang}>{native}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

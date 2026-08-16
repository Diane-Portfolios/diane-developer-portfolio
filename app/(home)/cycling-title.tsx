import { ROLE_BY_LANG, TITLE_PREFIX } from './cycle-phrases'
import { SEQUENCE, rotationStyle } from './rotation'

// Holds TITLE_PREFIX in English while the role after it rotates through every
// language, English included, on the shared clock in ./rotation. No client JS —
// each role is a stacked span whose CSS animation keeps it visible for its own
// slots, so it runs on first paint with no hydration flash and no interval.
export function CyclingTitle({ className = '' }: { className?: string }) {
  const codes = [...new Set(SEQUENCE)]

  return (
    // Always stacked — the role sits on its own line under the name at
    // every breakpoint now, rather than sharing a row from sm up, so a long
    // phrase in any language has the nav's full width to run instead of
    // risking an overflow/clip, and the two lines can carry distinct
    // weights without a shared baseline forcing them together.
    <span className={`flex flex-col items-start whitespace-normal ${className}`}>
      {/* Rendered once, outside the stack. It is not part of any animation and
          nothing below it can resize it, so it cannot move. font-bold is
          explicit here (not inherited from nav's className) so the name
          stays bold regardless of what weight the role below ends up at. */}
      <span className="font-bold text-white">{TITLE_PREFIX}</span>

      {/* Fixed-width column: as wide as the longest role, always. The colour
          lives here rather than on each state — without it these inherit the
          root's light-mode black and vanish against the black navbar.
          font-normal is explicit so the role reads distinctly lighter than
          the bold name above it, whatever weight nav.tsx's className sets. */}
      <span className="ns-cycle-stack font-normal text-neutral-300">
        {codes.map((code) => (
          <span
            key={code}
            // English is the one that survives if animation is disabled, so it
            // carries the base-visible class and the rest are hidden.
            className={code === 'en' ? 'ns-rot-default' : 'ns-rot'}
            // Only English is exposed; the rotation would otherwise read as a
            // dozen restatements of the same job title.
            aria-hidden={code === 'en' ? undefined : 'true'}
            lang={code === 'en' ? undefined : code}
            dir="auto"
            style={rotationStyle(code)}
          >
            {ROLE_BY_LANG[code]}
          </span>
        ))}
      </span>
    </span>
  )
}

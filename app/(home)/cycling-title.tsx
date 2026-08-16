import { ROLE_BY_LANG, TITLE_PREFIX } from './cycle-phrases'
import { SEQUENCE, rotationStyle } from './rotation'

// Holds TITLE_PREFIX in English while the role after it rotates through every
// language, English included, on the shared clock in ./rotation. No client JS —
// each role is a stacked span whose CSS animation keeps it visible for its own
// slots, so it runs on first paint with no hydration flash and no interval.
export function CyclingTitle({ className = '' }: { className?: string }) {
  const codes = [...new Set(SEQUENCE)]

  return (
    // items-baseline keeps the name and the role on one baseline even though
    // the CJK entries have very different metrics from the Latin ones.
    <span
      className={`inline-flex items-baseline whitespace-nowrap ${className}`}
    >
      {/* Rendered once, outside the stack. It is not part of any animation and
          nothing to its right can resize it, so it cannot move. */}
      <span className="text-white">{TITLE_PREFIX}&nbsp;</span>

      {/* Fixed-width column: as wide as the longest role, always. The colour
          lives here rather than on each state — without it these inherit the
          root's light-mode black and vanish against the black navbar. */}
      <span className="ns-cycle-stack text-neutral-300">
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

import {
  CONSOLE_LEFT_FROM_RIGHT,
  LEFT_COLUMN,
  SIDE_TEXT_VISIBLE,
} from './console-geometry'

const NAME = 'Diane Stephani'

// A single paragraph now, but kept as an array — the render below maps over
// it — so a future edit back to multiple paragraphs is a one-line change.
const ABOUT = [
  `I'm a software engineer with a background in games, specializing in localization, though I'm always open to other industries and projects! I work with marketing teams to translate promotional campaigns, and build automation tools to simplify their day-to-day. I also work with other engineers to fix bugs in our games.`,
]

// The paragraph wraps, so it only needs a sensible measure — the column less
// one gap so it doesn't touch the viewport edge, capped for readability.
const COLUMN = `min(calc(${LEFT_COLUMN} - var(--ns-side-gap)), 32rem)`

// The heading must not wrap, so it's sized against COLUMN — the box it actually
// sits in — rather than the wider LEFT_COLUMN. "Diane Stephani" measures 6.36em
// at this weight and tracking, so /6.9 leaves about 8% headroom.
const NAME_FONT = `min(2.25rem, calc(${COLUMN} / 6.9))`

// Sits left of the console, mirroring the location note on the right. Static:
// it's the one block on the page that never rotates.
export function AboutNote() {
  return (
    <div
      className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 [--ns-side-gap:3rem] xl:[--ns-side-gap:4rem] 2xl:[--ns-side-gap:5rem] ${SIDE_TEXT_VISIBLE}`}
      style={{
        top: '50%',
        // Anchored to the console's left edge, so the gap between the two holds
        // at every viewport size.
        right: `calc(${CONSOLE_LEFT_FROM_RIGHT} + var(--ns-side-gap))`,
        width: COLUMN,
      }}
    >
      {/* Inner wrapper: the entrance animates transform, and the positioned
          parent above carries the centring translate that it would clobber. */}
      <div className="ns-enter-side" style={{ animationDelay: '0.55s' }}>
        <h2
          className="whitespace-nowrap font-semibold tracking-tight text-white"
          style={{ fontSize: NAME_FONT }}
        >
          {NAME}
        </h2>

        {/* Smaller at the narrowest widths: the column there is barely 200px. */}
        <div className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-neutral-300 xl:text-sm 2xl:text-[0.9375rem]">
          {ABOUT.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

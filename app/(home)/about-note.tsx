const NAME = 'Diane Stephani'

// A single paragraph now, but kept as an array — the render below maps over
// it — so a future edit back to multiple paragraphs is a one-line change.
const ABOUT = [
  `I'm a software engineer with a background in games, specializing in localization, though I'm always open to other industries and projects! I work with marketing teams to translate promotional campaigns, and build automation tools to simplify their day-to-day.`,
]

// Top half of the hero's left column (see page.tsx), stacked above
// LocationNote. Capped width rather than filling the column: a wide block of
// this much small text reads as a denser "mass" than a narrower, taller one
// — the same reasoning that already applied when this sat beside the
// console instead of above the location note. Static: it's the one block on
// the page that never rotates.
export function AboutNote() {
  return (
    <div className="ns-enter-side max-w-[22rem] text-center" style={{ animationDelay: '0.55s' }}>
      <h2 className="text-4xl font-semibold tracking-tight text-white">{NAME}</h2>

      <div className="mt-4 space-y-3 text-sm leading-[1.7] text-neutral-300">
        {ABOUT.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>
    </div>
  )
}

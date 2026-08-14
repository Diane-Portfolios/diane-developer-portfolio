import {
  CONSOLE_LEFT_FROM_RIGHT,
  LEFT_COLUMN,
  ABOUT_VISIBLE,
} from './console-geometry'

const NAME = 'Diane Stephani'

// Three paragraphs, kept as separate strings so they render as real
// paragraphs rather than one block with line breaks faked inside it.
const ABOUT = [
  `I'm a software engineer with a background in games, and localization is where my heart really is…though I'm always excited to bring that same mindset to new industries and projects! As a kid I was fascinated by linguistics and human language, and learning programming languages felt like a very natural progression.`,
  `Before I found my way into engineering, I spent most of my professional career bartending and working as a personal trainer. Both of these industries sharpened skills I use every day: reading people, paying close attention to detail, and figuring out what someone actually needs/wants versus what they're asking for.`,
  `Once I learned software development, I started building tools that solved little problems I ran into on the gym floor or behind the bar. That instinct hasn't changed: I still love building tools that solve the small, real problems people run into. I've been on the ground level as a user myself, and I bring that perspective to how I build and improve the tools we all rely on.`,
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
      className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 [--ns-side-gap:3rem] xl:[--ns-side-gap:4rem] 2xl:[--ns-side-gap:5rem] ${ABOUT_VISIBLE}`}
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

        {/* Smaller at the narrowest widths: the column there is barely 200px, and
          at a larger size the copy runs long enough to fill the viewport. */}
        <div className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-neutral-300 xl:text-sm 2xl:text-[0.9375rem]">
          {ABOUT.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

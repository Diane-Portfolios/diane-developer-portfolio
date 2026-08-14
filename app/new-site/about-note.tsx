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
      {/* Scrim. The background photo is brightest right about here, and the
          body copy is the smallest text on the page, so it loses contrast.
          A radial gradient rather than a panel: it has no edge to notice, and
          the negative inset lets it fade out well past the text instead of
          stopping at the column. -z-10 keeps it behind this block's own text
          while staying above the photo — the block sets z-10 and is positioned,
          so it forms its own stacking context and the scrim can't escape it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[10%] -z-10"
        style={{
          background:
            'radial-gradient(ellipse 78% 62% at 46% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.28) 70%, rgba(0,0,0,0) 100%)',
        }}
      />

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
  )
}

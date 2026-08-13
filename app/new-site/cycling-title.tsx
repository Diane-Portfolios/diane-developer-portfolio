import {
  FINAL_FADE_MS,
  FINAL_ROLE,
  ROLE_PHRASES,
  TITLE_PREFIX,
  TOTAL_DURATION_MS,
} from './cycle-phrases'

// Holds TITLE_PREFIX in English while the role after it cycles through
// ROLE_PHRASES, settling on FINAL_ROLE at TOTAL_DURATION_MS. No client JS —
// each phrase is a stacked span whose CSS animation window is its slot, so it
// runs on first paint with no hydration flash and no interval to keep in sync.
export function CyclingTitle({ className = '' }: { className?: string }) {
  const cycleWindow = TOTAL_DURATION_MS - FINAL_FADE_MS
  const slot = cycleWindow / ROLE_PHRASES.length
  const lastIndex = ROLE_PHRASES.length - 1

  return (
    // items-baseline keeps the name and the role sitting on one baseline even
    // though the CJK entries have very different metrics from the Latin ones.
    <span
      className={`inline-flex items-baseline whitespace-nowrap ${className}`}
    >
      {/* Rendered once, outside the stack. It is not part of any animation and
          nothing to its right can resize it, so it cannot move. */}
      <span className="text-white">{TITLE_PREFIX}&nbsp;</span>

      {/* Fixed-width column: as wide as the longest phrase, always. */}
      <span className="ns-cycle-stack">
        <span
          className="ns-cycle-final text-white"
          style={{
            animationDelay: `${cycleWindow}ms`,
            animationDuration: `${FINAL_FADE_MS}ms`,
          }}
        >
          {FINAL_ROLE}
        </span>

        {ROLE_PHRASES.map((role, i) => (
          <span
            key={i}
            // Decorative: the settled role above is the accessible content, so
            // announcing every intermediate phrase would just be noise.
            aria-hidden="true"
            // dir="auto" so an RTL language added later lays out correctly.
            dir="auto"
            className="ns-cycle-slot text-neutral-400"
            style={{
              animationDelay: `${i * slot}ms`,
              // The last phrase is held through the English fade so the two
              // overlap instead of leaving a blank frame between them.
              animationDuration: `${i === lastIndex ? slot + FINAL_FADE_MS : slot}ms`,
            }}
          >
            {role}
          </span>
        ))}
      </span>
    </span>
  )
}

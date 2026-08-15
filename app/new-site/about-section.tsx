import { ScrollReveal } from './scroll-reveal'

// PLACEHOLDER — replace with your own paragraph. Left visibly marked (rather
// than lorem ipsum) so it can't accidentally ship as real copy.
const PLACEHOLDER = 'Write your About paragraph here.'

// The section below the hero. Its own component, matching the pattern the rest
// of /new-site follows — one file per block — so it can keep growing
// independently as more sections get added beneath it.
export function AboutSection() {
  return (
    <section className="relative bg-black">
      {/* Same max-w-6xl / px rhythm as the fixed nav, so this column lines up
          with it horizontally. pt-32 clears the nav with room to spare — the
          nav is fixed and overlays the top of every section as it scrolls
          beneath it, so content can't start flush with the section's own top
          edge. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:pt-40">
        {/* ml-auto pushes the column to the right within the wide container;
            text-right aligns the title and paragraph inside it. Wrapped in
            ScrollReveal rather than animating on mount (like the hero) — this
            section starts off-screen below the fold, so its entrance should
            fire when the visitor actually scrolls to it. */}
        <ScrollReveal className="ml-auto max-w-xl text-right">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            About
          </h2>
          <p className="mt-6 text-base italic leading-relaxed text-neutral-500 sm:text-lg">
            {PLACEHOLDER}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

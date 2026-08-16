import { ScrollReveal } from './scroll-reveal'

const ABOUT_PARAGRAPH = `I shipped Swapmeat on Steam, now localized in 6 languages. That project is where localization stopped being an abstract interest and became the thing I actually want to work on — figuring out how a game, a campaign, or a tool holds up when it's no longer just built for one language or one market. I like the technical side of that problem as much as the human side: the pipelines and automation that make it scalable, and the judgment calls that keep it feeling natural instead of translated. That's the kind of work I'm looking to keep doing.`

// The section below the hero. Its own component, matching the pattern the
// rest of the homepage follows — one file per block — so it can keep growing
// independently as more sections get added beneath it.
export function AboutSection() {
  return (
    // id="about" is the nav's anchor target. scroll-mt-24 isn't needed here
    // like it is on Experience/Projects below — the pt-32 padding already
    // clears the fixed nav on its own (see the comment on it) — but it's
    // harmless to have both, and keeps this section consistent with the
    // others if that padding ever changes.
    <section id="about" className="relative scroll-mt-24 bg-black">
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
          <p className="mt-6 text-base leading-relaxed text-neutral-500 sm:text-lg">
            {ABOUT_PARAGRAPH}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

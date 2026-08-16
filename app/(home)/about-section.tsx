import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const ABOUT_PARAGRAPH = `I shipped Swapmeat on Steam, now localized in 6 languages. That project is where localization stopped being an abstract interest and became the thing I actually want to work on — figuring out how a game, a campaign, or a tool holds up when it's no longer just built for one language or one market. I like the technical side of that problem as much as the human side: the pipelines and automation that make it scalable, and the judgment calls that keep it feeling natural instead of translated. That's the kind of work I'm looking to keep doing.`

// The section below the hero. Its own component, matching the pattern the
// rest of the homepage follows — one file per block — so it can keep growing
// independently as more sections get added beneath it.
export function AboutSection() {
  return (
    // id="about" is the nav's anchor target. scroll-mt-24 handles clearing
    // the fixed nav on a direct jump here on its own, so the padding below
    // is free to just be "however much breathing room looks right" rather
    // than also needing to cover for the nav.
    <section id="about" className="relative scroll-mt-24 bg-black">
      {/* Same max-w-6xl / px rhythm as the fixed nav, so this column lines up
          with it horizontally. pt-8/lg:pt-16 — cut by a full inch (96px) at
          each breakpoint from what this used to be (pt-32/lg:pt-40): with
          scroll-mt-24 already covering nav clearance, that padding was pure
          black space between the hero and this section's own content. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:pt-16">
        {/* ml-auto pushes the column to the right within the wide container,
            same as the pre-photo layout — max-w-xl gives it a definite width
            to push *within*, which is what makes ml-auto have any effect at
            all on a width:auto block. Single stacked column now: heading,
            then the Steam capsule art, then the paragraph, so the photo
            reads as illustrating the About heading rather than sitting
            beside the prose. Wrapped in ScrollReveal rather than animating
            on mount (like the hero) — this section starts off-screen below
            the fold, so its entrance should fire when the visitor actually
            scrolls to it. */}
        <ScrollReveal className="ml-auto max-w-xl text-right">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            About
          </h2>

          {/* ml-auto right-aligns the image within the column — text-align
              only affects inline content, so the heading/paragraph's
              text-right above doesn't touch this block-level element on its
              own. */}
          <Image
            src="/assets/backgrounds/swapmeat-steam.jpg"
            alt="Swap Meat on Steam"
            width={460}
            height={215}
            className="ml-auto mt-6 w-[460px] max-w-full rounded-lg"
          />

          <p className="mt-6 text-base leading-relaxed text-neutral-500 sm:text-lg">
            {ABOUT_PARAGRAPH}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

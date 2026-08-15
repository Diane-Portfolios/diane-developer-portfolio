import { ScrollReveal } from './scroll-reveal'

// PLACEHOLDER — replace with real contact copy/links. The old site's contact
// page (/old-site/contact) still has the actual working form wired to
// /api/contact; this section doesn't reuse it yet, so treat this as a stub
// until that form (or an equivalent) gets ported over.
const PLACEHOLDER = 'Write your Contact section here.'

// Last section on the page. text-left continues the About(right) /
// Experience(left) / Projects(right) alternation started above.
export function ContactSection() {
  return (
    // id="contact" is the nav's anchor target; scroll-mt-24 matches
    // Experience/Projects for the same reason — no other padding here
    // happens to already clear the fixed nav.
    <section id="contact" className="relative scroll-mt-24 bg-black">
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-24 sm:px-6">
        <ScrollReveal className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Contact
          </h2>
          <p className="mt-6 text-base italic leading-relaxed text-neutral-500 sm:text-lg">
            {PLACEHOLDER}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

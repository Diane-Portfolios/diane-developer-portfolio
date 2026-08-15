import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

// The band between About and the pill rows. Carries the background photo
// that used to live inside ProjectsSection, moved here unchanged — same
// image, same fill + object-cover + bg-black/45 scrim as the hero's — just
// shorter now that it only has to fit one heading instead of a heading plus
// six pills. "Projects" used to share this row with "Experience" but now
// lives at the top of ProjectsSection instead, right above the first pill —
// so this band is just the "Experience" title on its own.
export function ExperienceSection() {
  return (
    <section className="relative bg-black">
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/assets/backgrounds/unsplash-retro-desk.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="pointer-events-none select-none object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <ScrollReveal>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Experience
          </h2>
        </ScrollReveal>
      </div>
    </section>
  )
}

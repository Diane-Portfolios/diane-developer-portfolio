import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

// Copied straight from the resume — one entry for now, kept as an array (like
// AboutSection's paragraph) so a second job later is a one-line addition
// rather than a restructure.
const EXPERIENCE = [
  {
    title: 'Software Engineer',
    company: 'One More Game',
    dates: 'March 2026 – Present',
    bullets: [
      'Built and shipped the public-facing marketing website for SWAPMEAT, a multiplayer Steam title launched in 6 languages across global markets.',
      'Developed an automated Slack integration that scrapes and surfaces social media activity across platforms, used daily by the internal team for marketing intelligence.',
      'Built an operational player metrics dashboard powered by live game data via internal API, used to track participation and engagement post-launch.',
      'Contributed to the Unity codebase, resolving bugs and supporting game-side engineering during the post-launch stabilization period.',
      'Identified and proposed a consolidated Localization Engineer role to own the full localization pipeline across all 6 shipped languages — combining vendor management, producer coordination, and engineering — in anticipation of expansion into German, French, and Italian markets.',
    ],
  },
]

// The band between About and the pill rows. Carries the background photo
// that used to live inside ProjectsSection, moved here unchanged — same
// image, same fill + object-cover + bg-black/45 scrim as the hero's. Grown
// from just the "Experience" heading into a full section (heading + resume
// entries) over that same photo, the way ContactSection already carries a
// full form over its own photo rather than splitting into a bare heading
// band plus a separate solid-black body.
export function ExperienceSection() {
  return (
    // id="experience" is the nav's anchor target. scroll-mt-24 clears the
    // fixed nav on a direct jump here — unlike About, this section has no
    // padding of its own that happens to already cover that.
    <section id="experience" className="relative scroll-mt-24 bg-black">
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
          {/* No text-right/ml-auto here — About pushed right, this pushes
              left, continuing the alternation. */}
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Experience
          </h2>

          {/* max-w-2xl rather than About's narrower max-w-xl — these are
              dense, single-line resume bullets rather than conversational
              prose, and read better with a bit more width. Semitransparent
              panel (not applied to the heading above, which stays directly
              on the photo) so the resume text stays legible against the
              busy retro-desk background behind it.

              Carl (public/assets/backgrounds/carl-mirrored.png — a
              horizontally-mirrored version of Carl.png with the curly "CR"
              logo on his capsule left un-mirrored, composited back on so
              it still reads correctly) used to sit centered in the space
              to the right of this panel. Pulled off the page for now at
              request — the asset's kept around, ready to re-add. */}
          <div className="mt-10 max-w-2xl space-y-12 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm sm:p-8">
            {EXPERIENCE.map((job) => (
              <div key={job.title}>
                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  {job.title}
                </h3>
                <p className="mt-1 text-lg text-neutral-300">{job.company}</p>
                <p className="mt-1 text-sm text-neutral-500">{job.dates}</p>

                <ul className="mt-6 list-disc space-y-3 pl-5 text-neutral-300">
                  {job.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 32)}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const THUMB_SIZE = 64
const THUMB_COUNT = 6

// The Pokémon whose sprite appears next to the top ball. Hisuian Typhlosion
// (Fire/Ghost) is a distinct PokeAPI entry from base Typhlosion — it's keyed
// by the "-hisui" regional-form suffix, national dex #10233.
const TOP_POKEMON = 'typhlosion-hisui'

async function getFrontDefaultSprite(name: string): Promise<string | null> {
  try {
    // PokeAPI data for a given Pokémon is effectively static, so the default
    // fetch caching (cached indefinitely for a statically rendered route) is
    // exactly right — no need to refetch this on every build.
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.sprites?.front_default ?? null
  } catch {
    // Build-time network hiccup, PokeAPI down, whatever — the section should
    // still render without the sprite rather than fail the page.
    return null
  }
}

// The section below About. Just the heading, a placeholder Poké Ball stack,
// and one live sprite fetched from PokeAPI — real project entries replace all
// of this once there's something to show.
export async function ProjectsSection() {
  const spriteUrl = await getFrontDefaultSprite(TOP_POKEMON)

  return (
    <section className="relative bg-black">
      {/* Same max-w-6xl / px rhythm as the nav and the About section, so all
          three line up horizontally regardless of which edge their content
          hugs. No top padding to clear the fixed nav here — unlike About,
          this section never starts at the top of the viewport on load or on a
          direct scroll-to, so nothing needs to duck out from under it. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* No ml-auto / text-right here — About pushed right, this pushes
            left, so the two sections read as a deliberate alternation rather
            than everything defaulting to one side. */}
        <ScrollReveal className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h2>

          <div className="mt-8 flex flex-col items-start gap-4">
            {/* Top row only: the ball plus the fetched sprite alongside it. */}
            <div className="flex items-center gap-4">
              <Image
                src="/assets/backgrounds/poke-ball.webp"
                alt=""
                aria-hidden
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                // The source's corners are transparent (a circular graphic on
                // an alpha background, not a white square), so opacity reveals
                // the black section behind it rather than a translucent box.
                className="pointer-events-none select-none opacity-45"
              />

              {spriteUrl && (
                // Plain img rather than next/image: it's a one-off external
                // sprite from pokeapi.co's GitHub-hosted asset host, and
                // allow-listing that domain in next.config for a single
                // decorative image isn't worth the config change. Explicit
                // width/height avoid layout shift while it loads.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={spriteUrl}
                  alt=""
                  aria-hidden="true"
                  width={THUMB_SIZE}
                  height={THUMB_SIZE}
                  className="pointer-events-none select-none"
                />
              )}
            </div>

            {/* Remaining balls continue the stack underneath. */}
            {Array.from({ length: THUMB_COUNT - 1 }, (_, i) => (
              <Image
                key={i}
                src="/assets/backgrounds/poke-ball.webp"
                alt=""
                aria-hidden
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                className="pointer-events-none select-none opacity-45"
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

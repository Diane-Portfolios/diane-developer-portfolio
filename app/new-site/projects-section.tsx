import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const THUMB_SIZE = 64
const THUMB_COUNT = 7

// CSS defines 1in as exactly 96px (the "reference pixel"), independent of the
// display's real pixel density — it's the standard browsers use to convert
// physical units, so it's the correct way to target "an inch" in code. 128px
// = 1.33in, comfortably past the 96px/1in floor.
const SPRITE_SIZE = 128

// Shorter than both sprites, taller than the balls: 16px of padding around
// each ball, and 16px of each sprite poking out past the pill on top and
// bottom — both sprites are the same size, so this holds symmetrically.
const PILL_HEIGHT = 96

// How far each outer ball sits from its edge of the pill. Both pairs use the
// same value now, for a balls-to-edges layout that's symmetric left-to-right
// rather than the left ball sitting noticeably further in than the right one.
const LEFT_INSET = 24
const RIGHT_INSET = 24

// The Pokémon on the left: Hisuian Typhlosion (Fire/Ghost), a distinct
// PokeAPI entry from base Typhlosion, keyed by the "-hisui" regional-form
// suffix, national dex #10233.
const LEFT_POKEMON = 'typhlosion-hisui'

// The Pokémon on the right, using its official artwork rather than the small
// pixel sprite — a different field in the same API response (see
// getPokemonSprites below).
const RIGHT_POKEMON = 'charizard'

async function getPokemonSprites(name: string) {
  try {
    // PokeAPI data for a given Pokémon is effectively static, so the default
    // fetch caching (cached indefinitely for a statically rendered route) is
    // exactly right — no need to refetch this on every build.
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.sprites ?? null
  } catch {
    // Build-time network hiccup, PokeAPI down, whatever — the section should
    // still render without the sprite rather than fail the page.
    return null
  }
}

// Shared by both sprites: a plain img rather than next/image, since these are
// one-off externals from pokeapi.co's GitHub-hosted asset host and
// allow-listing that domain in next.config for two decorative images isn't
// worth the config change. Explicit width/height avoid layout shift.
function Sprite({ src, className = '' }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={SPRITE_SIZE}
      height={SPRITE_SIZE}
      className={`pointer-events-none select-none ${className}`}
    />
  )
}

// The section below About. Just the heading, a placeholder Poké Ball stack,
// and two live sprites fetched from PokeAPI — real project entries replace
// all of this once there's something to show.
export async function ProjectsSection() {
  // Independent lookups — run together rather than one after another.
  const [leftSprites, rightSprites] = await Promise.all([
    getPokemonSprites(LEFT_POKEMON),
    getPokemonSprites(RIGHT_POKEMON),
  ])
  // Both sides use the official-artwork field now — the small pixel sprite
  // (sprites.front_default) is no longer used anywhere in this section.
  const leftSpriteUrl = leftSprites?.other?.['official-artwork']?.front_default ?? null
  const rightSpriteUrl = rightSprites?.other?.['official-artwork']?.front_default ?? null

  return (
    <section className="relative bg-black">
      {/* Same max-w-6xl / px rhythm as the nav and the About section, so all
          three line up horizontally regardless of which edge their content
          hugs. No top padding to clear the fixed nav here — unlike About,
          this section never starts at the top of the viewport on load or on a
          direct scroll-to, so nothing needs to duck out from under it. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* No max-w-xl cap here (unlike About's paragraph column) — the pill
            in the top row needs to reach this container's own edges, which
            are exactly "the appropriate margin of the page": the same
            max-w-6xl/px-4/sm:px-6 gutter already used by the nav and About,
            not a new margin invented for this one element. */}
        <ScrollReveal>
          {/* No ml-auto / text-right here — About pushed right, this pushes
              left, so the two sections read as a deliberate alternation rather
              than everything defaulting to one side. */}
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h2>

          <div className="mt-8 flex flex-col items-start gap-4">
            {/* Top row: two ball+sprite pairs on a white pill that spans the
                full container width. relative/z-10 so this content sits above
                the pill (an absolutely-positioned sibling) rather than
                needing a stacking hack. */}
            <div className="relative z-10 flex w-full items-center justify-between">
              {/* The pill. Positioned absolute and centred on the row's own
                  height (governed by Charizard's 128px sprite, the tallest
                  thing in the row) rather than a hardcoded offset, so it
                  stays centred if that height ever changes. -z-10 keeps it
                  behind the balls and sprites without them needing their own
                  z-index.
                  Translucent white rather than translucent black: the section
                  behind it is already pure black, so an actual black fill at
                  any opacity would stay black and the pill would disappear.
                  White at low opacity is the standard way to get a visible
                  "frosted dark grey" panel against a black backdrop. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 rounded-full bg-white/15"
                style={{ height: PILL_HEIGHT }}
              />

              {/* Left pair: ball then sprite, shifted in from the pill's left
                  edge as a unit — the pill itself stays put. */}
              <div
                className="flex items-center gap-4"
                style={{ marginLeft: LEFT_INSET }}
              >
                <Image
                  src="/assets/backgrounds/poke-ball.webp"
                  alt=""
                  aria-hidden
                  width={THUMB_SIZE}
                  height={THUMB_SIZE}
                  className="pointer-events-none select-none"
                />

                {leftSpriteUrl && (
                  // Typhlosion's pose trails a tail far past its own left
                  // edge, with a lot of transparent canvas between the tail
                  // tip and the actual body mass — so aligning by the sprite's
                  // bounding box (as -ml-2 did) left the visible body no
                  // closer to the ball at all. Measured the source PNG's alpha
                  // channel directly: the body's leftmost point (the mane,
                  // near the top of the pose) sits 36px into the 128px box;
                  // the tail tip sits at 16px. -ml-11 (-44px) is solved so the
                  // MANE lands 8px clear of the ball — the tail, being further
                  // left, ends up overlapping the ball by about 12px as a
                  // consequence, which reads as the tail trailing behind it
                  // rather than the sprite floating unnaturally far away.
                  <Sprite src={leftSpriteUrl} className="-ml-11" />
                )}
              </div>

              {/* Right pair: sprite then ball, mirrored — the sprite sits
                  further into the pill ("just inside of" the ball), the ball
                  sits just inside the pill's right edge. flex-row-reverse
                  keeps the ball first in the DOM (so it's the one exposed to
                  justify-between's edge) while rendering it visually last. */}
              <div
                className="flex flex-row-reverse items-center gap-4"
                style={{ marginRight: RIGHT_INSET }}
              >
                <Image
                  src="/assets/backgrounds/poke-ball.webp"
                  alt=""
                  aria-hidden
                  width={THUMB_SIZE}
                  height={THUMB_SIZE}
                  className="pointer-events-none select-none"
                />

                {rightSpriteUrl && (
                  // Plain gap-4 (16px) — a bit more breathing room than the
                  // left pair's 8px, which is closer to its ball on purpose.
                  <Sprite src={rightSpriteUrl} />
                )}
              </div>
            </div>

            {/* Remaining balls continue the stack underneath, off the pill. */}
            {Array.from({ length: THUMB_COUNT - 2 }, (_, i) => (
              <Image
                key={i}
                src="/assets/backgrounds/poke-ball.webp"
                alt=""
                aria-hidden
                width={THUMB_SIZE}
                height={THUMB_SIZE}
                className="pointer-events-none select-none"
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

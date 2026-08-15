import Image from 'next/image'
import { ScrollReveal } from './scroll-reveal'

const THUMB_SIZE = 64

// CSS defines 1in as exactly 96px (the "reference pixel"), independent of the
// display's real pixel density — it's the standard browsers use to convert
// physical units, so it's the correct way to target "an inch" in code. 128px
// = 1.33in, comfortably past the 96px/1in floor.
const SPRITE_SIZE = 128

// Shorter than both sprites, taller than the balls: 16px of padding around
// each ball, and 16px of each sprite poking out past the pill on top and
// bottom — both sprites are the same size, so this holds symmetrically.
const PILL_HEIGHT = 96

// How far each outer ball sits from its edge of the pill, in every row.
const LEFT_INSET = 24
const RIGHT_INSET = 24

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

// Shared by every sprite in every row: a plain img rather than next/image,
// since these are one-off externals from pokeapi.co's GitHub-hosted asset
// host and allow-listing that domain in next.config for a handful of
// decorative images isn't worth the config change. Explicit width/height
// avoid layout shift. Always the official-artwork field, never the small
// pixel sprite.
function Sprite({
  src,
  flip,
}: {
  src: string
  // Mirrors the artwork horizontally via CSS, around the image's own centre.
  flip?: boolean
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={SPRITE_SIZE}
      height={SPRITE_SIZE}
      className="pointer-events-none select-none"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    />
  )
}

// PLACEHOLDER — replace with a real project name and one-line description.
// Not a link yet since there's nowhere for it to go; swap the wrapping div for
// a Link once project pages exist. The hover glow already behaves like a real
// clickable element so the transition to an actual link is purely mechanical.
function ProjectLabel() {
  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.75)]"
    >
      <h3 className="text-lg font-semibold tracking-tight text-white">
        Project Name
      </h3>
      <p className="mt-1 text-sm italic text-neutral-400">Subtitle</p>
    </div>
  )
}

// One ball+sprite+ball+sprite row on a pill — the template. Every row uses
// the same plain gap-4 spacing on both sides, so the left-hand sprites line
// up in a consistent column down the page regardless of what each one's own
// bounding box looks like — no per-Pokémon margin tuning.
async function PillRow({
  leftPokemon,
  rightPokemon,
  flipLeftSprite,
}: {
  leftPokemon: string
  rightPokemon: string
  flipLeftSprite?: boolean
}) {
  const [leftSprites, rightSprites] = await Promise.all([
    getPokemonSprites(leftPokemon),
    getPokemonSprites(rightPokemon),
  ])
  const leftSpriteUrl = leftSprites?.other?.['official-artwork']?.front_default ?? null
  const rightSpriteUrl = rightSprites?.other?.['official-artwork']?.front_default ?? null

  return (
    <div className="relative z-10 flex w-full items-center justify-between">
      {/* The pill. Positioned absolute and centred on the row's own height
          (governed by the 128px sprites, the tallest things in the row)
          rather than a hardcoded offset, so it stays centred if that height
          ever changes. -z-10 keeps it behind the balls and sprites without
          them needing their own z-index.
          Translucent white rather than translucent black: the section behind
          it is already pure black, so an actual black fill at any opacity
          would stay black and the pill would disappear. White at low opacity
          is the standard way to get a visible "frosted dark grey" panel
          against a black backdrop. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 rounded-full bg-white/15"
        style={{ height: PILL_HEIGHT }}
      />

      {/* Left pair: ball then sprite, shifted in from the pill's left edge as
          a unit — the pill itself stays put. */}
      <div className="flex items-center gap-4" style={{ marginLeft: LEFT_INSET }}>
        <Image
          src="/assets/backgrounds/poke-ball.webp"
          alt=""
          aria-hidden
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="pointer-events-none select-none"
        />

        {leftSpriteUrl && <Sprite src={leftSpriteUrl} flip={flipLeftSprite} />}
      </div>

      {/* Room for a project name + subtitle in the pill's open middle,
          centred on both axes independently of the two ball+sprite pairs
          (which are flex children of this row; this is a separate absolutely
          positioned sibling, so it can't be pushed around by their widths). */}
      <ProjectLabel />

      {/* Right pair: sprite then ball, mirrored — the sprite sits further
          into the pill ("just inside of" the ball), the ball sits just
          inside the pill's right edge. flex-row-reverse keeps the ball first
          in the DOM (so it's the one exposed to justify-between's edge)
          while rendering it visually last. Plain gap-4, no tuning — see the
          note on PillRow. */}
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

        {rightSpriteUrl && <Sprite src={rightSpriteUrl} />}
      </div>
    </div>
  )
}

// All six Pokémon pill rows, on their own plain black section below
// ExperienceSection, with the "Projects" title right above the first pill —
// text-right to keep the About/Experience/Projects alternation going (About
// right, Experience left, Projects right) now that Projects has its own
// section again rather than sharing ExperienceSection's row. Real project
// entries replace the placeholder labels once there's something to show. The
// plain, unpaired Poké Balls that used to stack below these (left over from
// before any pill existed) are gone now that every ball on the page sits
// inside one.
export async function ProjectsSection() {
  return (
    <section className="relative bg-black">
      {/* Same max-w-6xl / px rhythm as the nav and the About section, so this
          lines up with them horizontally. pt-24/pb-24: symmetric now that the
          heading lives in here again, matching the breathing room the bottom
          edge always had. */}
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <ScrollReveal className="text-right">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h2>
        </ScrollReveal>

        {/* Each pill gets its own ScrollReveal rather than one wrapping the
            whole list — that made every row appear at once the moment the
            top of the list crossed into view. Individual observers mean each
            row fades in independently right as it crosses the threshold, so
            they render one-by-one while the visitor scrolls down them.
            w-full on the wrapper matters: without it the wrapper (now the
            actual flex child) shrinks to fit content under this container's
            items-start, and PillRow's own w-full inside it would have
            nothing to be 100% of. items-start still reads as centred — every
            pill is w-full, so cross-axis alignment never actually shows. */}
        <div className="mt-8 flex flex-col items-start gap-4">
          {/* Hisuian Typhlosion (Fire/Ghost) — a distinct PokeAPI entry
              from base Typhlosion, keyed by the "-hisui" regional-form
              suffix, national dex #10233 — paired with Charizard. */}
          <ScrollReveal className="w-full">
            <PillRow leftPokemon="typhlosion-hisui" rightPokemon="charizard" />
          </ScrollReveal>

          {/* Ceruledge (Fire/Ghost), flipped — paired with Milotic. */}
          <ScrollReveal className="w-full">
            <PillRow leftPokemon="ceruledge" rightPokemon="milotic" flipLeftSprite />
          </ScrollReveal>

          {/* Annihilape, flipped — paired with Scovillain. */}
          <ScrollReveal className="w-full">
            <PillRow leftPokemon="annihilape" rightPokemon="scovillain" flipLeftSprite />
          </ScrollReveal>

          {/* Basculegion, flipped — paired with Dragapult. PokeAPI has no
              bare "basculegion" — it only resolves as basculegion-male or
              basculegion-female — so the male variety is used here. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="basculegion-male"
              rightPokemon="dragapult"
              flipLeftSprite
            />
          </ScrollReveal>

          {/* Froslass, unflipped — paired with Skeledirge. */}
          <ScrollReveal className="w-full">
            <PillRow leftPokemon="froslass" rightPokemon="skeledirge" />
          </ScrollReveal>

          {/* Golurk, flipped — paired with Garchomp. */}
          <ScrollReveal className="w-full">
            <PillRow leftPokemon="golurk" rightPokemon="garchomp" flipLeftSprite />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

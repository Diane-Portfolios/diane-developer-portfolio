import Image from 'next/image'
import { CustomMDX } from '../components/mdx'
import { formatDate, getBlogPosts } from '../old-site/blog/utils'
import { ProjectLabel } from './project-label'
import { ScrollReveal } from './scroll-reveal'

// Intrinsic size passed to Image/img for quality/aspect-ratio — the
// *displayed* size is set responsively via Tailwind classes at each call
// site instead (h-9 w-9 sm:h-16 sm:w-16, etc.), so these stay the desktop
// (sm+) pixel values.
const THUMB_SIZE = 64

// CSS defines 1in as exactly 96px (the "reference pixel"), independent of the
// display's real pixel density — it's the standard browsers use to convert
// physical units, so it's the correct way to target "an inch" in code. 128px
// = 1.33in, comfortably past the 96px/1in floor.
const SPRITE_SIZE = 128

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
      // Half size below sm: two of these plus two balls at full size left
      // almost no room for the title between them on a phone-width screen —
      // see the note on the row below.
      className="pointer-events-none h-16 w-16 select-none sm:h-32 sm:w-32"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    />
  )
}

// One ball+sprite+ball+sprite row on a pill — the template. Every row uses
// the same plain gap on both sides (responsive, but never per-Pokémon-tuned),
// so the left-hand sprites line up in a consistent column down the page
// regardless of what each one's own bounding box looks like.
//
// projectSlug looks the post up from the old site's own blog posts
// (app/old-site/blog/posts/*.mdx) via the same getBlogPosts() that site
// still uses — one real source of content instead of a second copy. Only the
// title renders in the pill itself for now (no subtitle yet); the full
// post — same title, date, and MDX body the old blog page rendered — opens
// in ProjectLabel's popup on click.
// Exported (in addition to being used internally by ProjectsSection) so it's
// directly testable — as an async Server Component it can only be invoked as
// a plain function and awaited, not rendered via JSX through a normal client
// render tree.
export async function PillRow({
  leftPokemon,
  rightPokemon,
  flipLeftSprite,
  projectSlug,
}: {
  leftPokemon: string
  rightPokemon: string
  flipLeftSprite?: boolean
  projectSlug: string
}) {
  const [leftSprites, rightSprites] = await Promise.all([
    getPokemonSprites(leftPokemon),
    getPokemonSprites(rightPokemon),
  ])
  const leftSpriteUrl = leftSprites?.other?.['official-artwork']?.front_default ?? null
  const rightSpriteUrl = rightSprites?.other?.['official-artwork']?.front_default ?? null

  const post = getBlogPosts().find((p) => p.slug === projectSlug)

  return (
    // items-center + a shorter row below sm: the label used to be a
    // same-height absolutely positioned sibling at every width, which only
    // works when the ball+sprite pairs leave real space clear in the middle
    // — true on desktop, not on a phone-width screen where they alone were
    // nearly the full row width. Below sm the label is now a normal flex-1
    // child instead (see the note on it), so justify-between still applies
    // but the middle is no longer floating independently over the sprites.
    <div className="relative z-10 flex w-full items-center justify-between">
      {/* The pill. Positioned absolute and centred on the row's own height
          (governed by the sprites, the tallest things in the row — 64px
          below sm, 128px at sm and up) rather than a hardcoded offset, so it
          stays centred at either size. -z-10 keeps it behind the balls and
          sprites without them needing their own z-index.
          Translucent white rather than translucent black: the section behind
          it is already pure black, so an actual black fill at any opacity
          would stay black and the pill would disappear. White at low opacity
          is the standard way to get a visible "frosted dark grey" panel
          against a black backdrop. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 h-20 -translate-y-1/2 rounded-full bg-white/15 sm:h-24"
      />

      {/* Left pair: ball then sprite, shifted in from the pill's left edge as
          a unit — the pill itself stays put. Smaller gap/inset below sm to
          match the smaller sprites there, so the pair doesn't eat more of a
          narrow row than it has to. */}
      <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-6 sm:gap-4">
        <Image
          src="/assets/backgrounds/poke-ball.webp"
          alt=""
          aria-hidden
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="pointer-events-none h-9 w-9 select-none sm:h-16 sm:w-16"
        />

        {leftSpriteUrl && <Sprite src={leftSpriteUrl} flip={flipLeftSprite} />}
      </div>

      {/* Room for the project title in the pill's open middle. At sm and up
          this is a separate absolutely positioned sibling, centred on both
          axes independently of the two ball+sprite pairs — exactly as
          before. Below sm it's a normal flex-1 child instead: absolute
          centring only ever leaves the label clear of the sprites when
          they're small relative to the row, which isn't true on a phone —
          as an in-flow flex child, the space it gets is however much the
          (now-smaller) ball+sprite pairs don't take, so it can never
          overlap them regardless of title length. min-w-0 lets it actually
          shrink to that space instead of flexbox refusing to size it below
          the unwrapped title's own width. Positioning lives here rather
          than in the (client) ProjectLabel component so ProjectLabel only
          has to own the click/modal behaviour. */}
      {post && (
        <div className="pointer-events-auto min-w-0 flex-1 px-1 text-center sm:absolute sm:left-1/2 sm:top-1/2 sm:flex-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-0">
          <ProjectLabel title={post.metadata.title} dateLabel={formatDate(post.metadata.publishedAt)}>
            <CustomMDX source={post.content} />
          </ProjectLabel>
        </div>
      )}

      {/* Right pair: sprite then ball, mirrored — the sprite sits further
          into the pill ("just inside of" the ball), the ball sits just
          inside the pill's right edge. flex-row-reverse keeps the ball first
          in the DOM (so it's the one exposed to justify-between's edge)
          while rendering it visually last. Plain gap, no tuning — see the
          note on PillRow. */}
      <div className="mr-2 flex shrink-0 flex-row-reverse items-center gap-2 sm:mr-6 sm:gap-4">
        <Image
          src="/assets/backgrounds/poke-ball.webp"
          alt=""
          aria-hidden
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="pointer-events-none h-9 w-9 select-none sm:h-16 sm:w-16"
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
// section again rather than sharing ExperienceSection's row. Each pill's
// title is real project content now (see projectSlug on PillRow); only the
// titles show here so far, ordered to match what was asked for — a subtitle
// per project can follow later. The plain, unpaired Poké Balls that used to
// stack below these (left over from
// before any pill existed) are gone now that every ball on the page sits
// inside one.
export async function ProjectsSection() {
  return (
    // id="projects" is the nav's anchor target; scroll-mt-24 clears the fixed
    // nav the same way Experience's does.
    <section id="projects" className="relative scroll-mt-24 bg-black">
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
            <PillRow
              leftPokemon="typhlosion-hisui"
              rightPokemon="charizard"
              projectSlug="wonderbot-1000"
            />
          </ScrollReveal>

          {/* Ceruledge (Fire/Ghost), flipped — paired with Milotic. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="ceruledge"
              rightPokemon="milotic"
              flipLeftSprite
              projectSlug="playswapmeat"
            />
          </ScrollReveal>

          {/* Annihilape, flipped — paired with Scovillain. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="annihilape"
              rightPokemon="scovillain"
              flipLeftSprite
              // Household OS's post file is named house-ops.mdx.
              projectSlug="house-ops"
            />
          </ScrollReveal>

          {/* Basculegion, flipped — paired with Dragapult. PokeAPI has no
              bare "basculegion" — it only resolves as basculegion-male or
              basculegion-female — so the male variety is used here. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="basculegion-male"
              rightPokemon="dragapult"
              flipLeftSprite
              projectSlug="moonbob-money"
            />
          </ScrollReveal>

          {/* Froslass, unflipped — paired with Skeledirge. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="froslass"
              rightPokemon="skeledirge"
              // Laango Scheduling Service's post file is named laango-django.mdx.
              projectSlug="laango-django"
            />
          </ScrollReveal>

          {/* Golurk, flipped — paired with Garchomp. */}
          <ScrollReveal className="w-full">
            <PillRow
              leftPokemon="golurk"
              rightPokemon="garchomp"
              flipLeftSprite
              projectSlug="apre-method"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

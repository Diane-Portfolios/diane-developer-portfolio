import Image from 'next/image'
import type { CSSProperties } from 'react'
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
  marginLeftPx,
  flip,
}: {
  src: string
  marginLeftPx?: number
  // Mirrors the artwork horizontally via CSS, around the image's own centre —
  // this changes what's *drawn* inside the box, not the box itself, so it
  // doesn't touch marginLeftPx's positioning. It does, however, swap which
  // side of the source PNG ends up at the box's left edge, which is why
  // marginLeftPx can't always be reused as-is after flipping — see the
  // comment on Ceruledge's usage below for why it happens to still work here.
  flip?: boolean
}) {
  const style: CSSProperties = {}
  if (marginLeftPx !== undefined) style.marginLeft = marginLeftPx
  if (flip) style.transform = 'scaleX(-1)'
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={SPRITE_SIZE}
      height={SPRITE_SIZE}
      className="pointer-events-none select-none"
      style={Object.keys(style).length ? style : undefined}
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

// One ball+sprite+ball+sprite row on a pill — the template. Two of these
// exist, differing only in which Pokémon they show and (optionally) how far
// the left sprite is pulled toward its ball.
//
// leftBodyMarginPx overrides the left sprite's plain gap-4 spacing. It exists
// because a sprite's bounding box often isn't where the character visually
// reads as being — Hisuian Typhlosion's pose trails a tail far past its own
// body, so aligning by the box (the default) left the actual body no closer
// to the ball at all. The fix, applied per-Pokémon rather than globally: pull
// the official-artwork PNG down, scan its alpha channel for the leftmost
// opaque pixel, walk outward from there while the silhouette changes
// smoothly (following the trailing appendage), and take the next-most-extreme
// point outside that band as "the body." Solve the margin that lands the body
// clear of the ball by the target gap. The appendage itself is free to
// overlap the ball as a consequence — that reads as it trailing behind rather
// than the sprite floating unnaturally far away.
//
// The right sprite is never tuned this way — it stays at the plain gap-4 for
// both rows, matching the template's original asymmetry (Charizard was never
// tuned either) rather than re-deriving a correction nobody asked for.
async function PillRow({
  leftPokemon,
  rightPokemon,
  leftBodyMarginPx,
  flipLeftSprite,
}: {
  leftPokemon: string
  rightPokemon: string
  leftBodyMarginPx?: number
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

        {leftSpriteUrl && (
          <Sprite
            src={leftSpriteUrl}
            marginLeftPx={leftBodyMarginPx}
            flip={flipLeftSprite}
          />
        )}
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

// The section below About. Just the heading and two Pokémon pill rows — real
// project entries replace the placeholder labels once there's something to
// show. The plain, unpaired Poké Balls that used to stack below these (left
// over from before any pill existed) are gone now that every ball on the page
// sits inside one.
export async function ProjectsSection() {
  return (
    <section className="relative bg-black">
      {/* Same max-w-6xl / px rhythm as the nav and the About section, so all
          three line up horizontally regardless of which edge their content
          hugs. No top padding to clear the fixed nav here — unlike About,
          this section never starts at the top of the viewport on load or on a
          direct scroll-to, so nothing needs to duck out from under it. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* No max-w-xl cap here (unlike About's paragraph column) — each pill
            needs to reach this container's own edges, which are exactly "the
            appropriate margin of the page": the same max-w-6xl/px-4/sm:px-6
            gutter already used by the nav and About, not a new margin
            invented for this element. */}
        <ScrollReveal>
          {/* No ml-auto / text-right here — About pushed right, this pushes
              left, so the two sections read as a deliberate alternation rather
              than everything defaulting to one side. */}
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h2>

          <div className="mt-8 flex flex-col items-start gap-4">
            {/* Hisuian Typhlosion (Fire/Ghost) — a distinct PokeAPI entry
                from base Typhlosion, keyed by the "-hisui" regional-form
                suffix, national dex #10233 — paired with Charizard.
                -32px: the tail is the sprite's true leftmost point, but the
                body (the mane, near the top of the pose) sits 36px into the
                128px box. -44px was solved to land the mane exactly 8px from
                the ball; -32px backs off by 12px so it reads as "moved right
                a little" rather than pinned to that exact figure. */}
            <PillRow
              leftPokemon="typhlosion-hisui"
              rightPokemon="charizard"
              leftBodyMarginPx={-32}
            />

            {/* Ceruledge (Fire/Ghost), flipped to face left — its official
                artwork faces right unflipped — paired with Milotic, which
                already faces left without needing one.
                -34px still applies after the flip: Ceruledge's pose turned
                out to be near-perfectly bilaterally symmetric, so the source
                image's right-side profile (which becomes the box's left edge
                once mirrored) landed the body point at the same 38px-into-
                the-box offset the unflipped left side gave — confirmed by
                re-running the same alpha-scan on that side rather than
                assuming the symmetry held. */}
            <PillRow
              leftPokemon="ceruledge"
              rightPokemon="milotic"
              leftBodyMarginPx={-34}
              flipLeftSprite
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

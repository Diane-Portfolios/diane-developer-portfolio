import Image from 'next/image'
import { getPokemonArtworkUrl } from './pokemon-artwork'
import { ScrollReveal } from './scroll-reveal'

const ABOUT_PARAGRAPH = `I shipped Swapmeat on Steam, now localized in 6 languages. That project is where localization stopped being an abstract interest and became the thing I actually want to work on — figuring out how a game, a campaign, or a tool holds up when it's no longer just built for one language or one market. I like the technical side of that problem as much as the human side: the pipelines and automation that make it scalable, and the judgment calls that keep it feeling natural instead of translated. That's the kind of work I'm looking to keep doing.`

// The team's own six Pokémon (top row, left-aligned) and the six they're
// each paired against (bottom row, right-aligned) — the same twelve
// left/right pairings ProjectsSection's pill rows used to display via
// on-pill sprites, now that those have moved up here instead (see the note
// on ProjectsSection).
const TEAM_POKEMON = [
  'typhlosion-hisui',
  'ceruledge',
  'annihilape',
  'basculegion-female',
  'froslass',
  'golurk',
]

// Mirrored horizontally, same as these four were via flipLeftSprite on
// ProjectsSection's old pill rows — kept as a name set rather than
// per-entry data on TEAM_POKEMON since it only ever applies to the top row.
const FLIPPED_TEAM_POKEMON = new Set(['ceruledge', 'annihilape', 'basculegion-female', 'golurk'])
const OPPONENT_POKEMON = [
  'charizard',
  'milotic',
  'scovillain',
  'dragapult',
  'skeledirge',
  'garchomp',
]

// Started at 32px (half of ProjectsSection's old 64px poke-ball
// thumbnails), then bumped up twice — to 40px, then to 56px — since each
// prior size still read as too small to register clearly at a glance.
const TEAM_SPRITE_SIZE = 56

// Plain img rather than next/image, same reasoning as ProjectsSection's own
// Sprite: these are one-off externals from pokeapi.co's GitHub-hosted asset
// host, and allow-listing that domain in next.config for a handful of
// decorative images isn't worth the config change.
function TeamSprite({
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
      width={TEAM_SPRITE_SIZE}
      height={TEAM_SPRITE_SIZE}
      className="pointer-events-none h-14 w-14 select-none"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    />
  )
}

// The section below the hero. Its own component, matching the pattern the
// rest of the homepage follows — one file per block — so it can keep growing
// independently as more sections get added beneath it.
export async function AboutSection() {
  const [teamSpriteUrls, opponentSpriteUrls] = await Promise.all([
    Promise.all(TEAM_POKEMON.map(getPokemonArtworkUrl)),
    Promise.all(OPPONENT_POKEMON.map(getPokemonArtworkUrl)),
  ])

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
        {/* Left-aligned regardless of the rest of the section (which sits in
            an ml-auto grid pushed to the right) — this row is meant to read
            as sitting above the section's left edge, not as part of that
            grid's own alignment. */}
        <div className="mb-6 flex items-center gap-2">
          {TEAM_POKEMON.map((name, i) => {
            const src = teamSpriteUrls[i]
            return src && <TeamSprite key={name} src={src} flip={FLIPPED_TEAM_POKEMON.has(name)} />
          })}
        </div>

        {/* about-layout (see globals.css) is a CSS Grid with named areas: the
            photo sits between the heading and paragraph in one column below
            lg, then moves to their left beside a two-row text column at lg
            — see the comment on .about-layout for why this needs grid areas
            rather than plain flex. ml-auto pushes the whole grid right
            within this wide container, same as before — needs the grid's
            own width to be definite for ml-auto to have anything to push
            within, which .about-layout's own width:fit-content/max-width
            provide. Wrapped in ScrollReveal rather than animating on mount
            (like the hero) — this section starts off-screen below the
            fold, so its entrance should fire when the visitor actually
            scrolls to it. */}
        <ScrollReveal className="about-layout ml-auto">
          <h2 className="about-title text-right text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            About
          </h2>

          <Image
            src="/assets/backgrounds/swapmeat-steam.jpg"
            alt="Swap Meat on Steam"
            width={460}
            height={215}
            className="about-photo w-[460px] max-w-full rounded-lg"
          />

          <p className="about-para text-right text-base leading-relaxed text-neutral-500 sm:text-lg">
            {ABOUT_PARAGRAPH}
          </p>
        </ScrollReveal>

        {/* The opponents each team Pokémon above was paired against on its
            old ProjectsSection pill, in the same left-to-right order —
            right-aligned as this row's own mirror of the left-aligned one
            at the top, rather than matching the ml-auto grid above it.
            mt-14 rather than mt-6: pushed down an extra line's worth of
            space below the paragraph. */}
        <div className="mt-14 flex items-center justify-end gap-2">
          {OPPONENT_POKEMON.map((name, i) => {
            const src = opponentSpriteUrls[i]
            return src && <TeamSprite key={name} src={src} />
          })}
        </div>
      </div>
    </section>
  )
}

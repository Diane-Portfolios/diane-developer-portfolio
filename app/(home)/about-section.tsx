import Image from 'next/image'
import { getPokemonArtworkUrl } from './pokemon-artwork'
import { ScrollReveal } from './scroll-reveal'

// The childhood-origin story leads, with the Swapmeat paragraph kept below
// it as where that origin led — the photo alongside them is still the
// Swapmeat Steam screenshot, so the second paragraph is what still ties it
// to what's actually pictured.
const FIRST_ABOUT_PARAGRAPH = `I started figuring out that I wanted to work in localization before I even knew what it was: it was 1998, I was 6 years old, and I was playing Pokemon Yellow Version on my purple GameBoy Color. This text-heavy game was rapidly improving my ability to read. I was fascinated with the franchise, I was learning about where it came from in Japan, and I was discovering what it really meant to speak another language. Eventually I'd grow up to play more Pokemon games in Japanese, French, and Spanish.`

// Split around the "Swapmeat on Steam" link rather than kept as one string
// like the first paragraph — the phrase itself becomes the link text below.
const SWAPMEAT_STEAM_URL = 'https://store.steampowered.com/app/2790700/SWAPMEAT/'
const SECOND_ABOUT_PARAGRAPH_PREFIX = `Fast-forwarding to my professional career, I shipped `
const SECOND_ABOUT_PARAGRAPH_SUFFIX = `, localized in 6 languages. Swapmeat is the project that solidified localization as the piece I really want to work on — figuring out how a game, a campaign, or a tool holds up when it's no longer just built for one language or one market. I like the technical side of that problem as much as the human side: the pipelines and automation that make it scalable, and the judgment calls that keep it feeling natural instead of translated. That's the kind of work I'm looking to keep doing.`

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
          with it horizontally. pt-4/lg:pt-8 — cut further still from
          pt-8/lg:pt-16: with scroll-mt-24 already covering nav clearance,
          that padding was pure black space between the hero and the
          Typhlosion-through-Golurk sprite row now leading this section. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 lg:pt-8">
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

          {/* Two variants, toggled by breakpoint, rather than one element
              doing both jobs — that was tried and broke in both
              directions:

              A plain sized <img> (no wrapper) is a "replaced element", so
              browsers fall back to its own width/height attributes when
              max-w-full's percentage has no definite parent to resolve
              against (.about-layout is width:fit-content below lg) — that
              plain-<img> fallback is what correctly shrinks the photo on
              narrow screens. But that same plain <img> also contributes
              its own full intrinsic height to the grid's row-height
              calculation, so at lg the para row grew to match the photo's
              full height instead of the other way around — no crop.

              A `fill` image inside a sized wrapper <div> fixes *that* (an
              absolutely-positioned fill image contributes ~0 intrinsic
              size, so the row is free to size to the paragraph instead,
              and the image just stretches into whatever height that
              produces) — but a generic, non-replaced <div> doesn't get
              the same max-w-full fallback a plain <img> gets, so that
              version overflowed the page below lg instead.

              Splitting into two images sidesteps the conflict: below lg,
              the plain <img> variant (lg:hidden) renders at its native
              1200×1800 (2:3) ratio, uncropped. At lg+, the `fill` variant
              (hidden lg:block) stretches to the para row's own height
              (.about-photo's align-self: stretch in globals.css), and
              object-bottom crops the excess off the *top* of the photo —
              so the image's bottom edge lands on the paragraph's last
              line, and since that row starts where the paragraph itself
              starts, the top edge lands on the paragraph's first line. */}
          <Image
            src="/assets/backgrounds/pokeball-glow.jpg"
            alt="A glowing Poké Ball wrapped in string lights, with a neon Pikachu-ear lamp and a holographic disc in the background"
            width={460}
            height={690}
            className="about-photo w-[460px] max-w-full rounded-lg lg:hidden"
          />
          <div className="about-photo relative hidden w-[460px] overflow-hidden rounded-lg lg:block">
            <Image
              src="/assets/backgrounds/pokeball-glow.jpg"
              alt="A glowing Poké Ball wrapped in string lights, with a neon Pikachu-ear lamp and a holographic disc in the background"
              fill
              sizes="460px"
              className="object-cover object-bottom"
            />
          </div>

          {/* .about-para is a single named grid area (see globals.css), so
              both paragraphs live inside one wrapper occupying it rather
              than each carrying the class themselves — two grid items both
              claiming the same area would just overlap. */}
          {/* text-pretty (text-wrap: pretty) rather than a smaller font:
              shrinking the text just moves the "Spanish."-style orphan
              line to a different viewport width instead of removing it —
              text-wrap: pretty is the browser actually solving that
              layout problem, at whatever width the paragraph renders. */}
          <div className="about-para space-y-4 text-pretty text-right text-sm leading-relaxed text-neutral-500 sm:text-base">
            <p>{FIRST_ABOUT_PARAGRAPH}</p>
            <p>
              {SECOND_ABOUT_PARAGRAPH_PREFIX}
              <a
                href={SWAPMEAT_STEAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-white"
              >
                Swapmeat on Steam
              </a>
              {SECOND_ABOUT_PARAGRAPH_SUFFIX}
            </p>
          </div>
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

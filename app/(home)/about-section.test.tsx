import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AboutSection } from './about-section'

// AboutSection is an async Server Component now that it fetches the team's
// PokeAPI artwork (see pokemon-artwork.ts) — same reasoning as
// ProjectsSection's ProjectTile (see the note atop projects-section.test.tsx):
// it has to be awaited and rendered from its resolved element rather than
// passed to render() directly.
function mockPokeApiFetch() {
  return vi.fn(async (url: string) => {
    const name = url.split('/').pop()
    return {
      ok: true,
      json: async () => ({
        sprites: {
          other: {
            'official-artwork': {
              front_default: `https://example.com/sprites/${name}.png`,
            },
          },
        },
      }),
    }
  })
}

describe('AboutSection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockPokeApiFetch())
  })

  it('has id="about", the nav\'s anchor target', async () => {
    const { container } = render(await AboutSection())
    expect(container.querySelector('#about')).toBeInTheDocument()
  })

  it('renders the About heading', async () => {
    render(await AboutSection())
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
  })

  it('places the heading, photo, and paragraphs in that reading order in the DOM', async () => {
    render(await AboutSection())

    const heading = screen.getByRole('heading', { name: 'About' })
    // Two photo elements exist — see the note on about-section.tsx for why
    // (a plain <img> below lg, a `fill` variant at lg+, toggled by
    // lg:hidden/hidden lg:block since neither sizing approach works at
    // every breakpoint on its own). Either stands in for "the photo" here.
    const [photo] = screen.getAllByAltText(/glowing Poké Ball/)
    const paragraphs = screen.getByText(/I started figuring out/)

    // DOCUMENT_POSITION_FOLLOWING means the argument comes *after* the node
    // compareDocumentPosition was called on. This is the DOM/reading order
    // (heading, then photo, then paragraphs) — below lg that also happens to
    // be the visual stacking order, but at lg the .about-layout grid (see
    // globals.css) moves the photo to the left of both via CSS grid areas,
    // which jsdom doesn't evaluate; see the class-based test below for that.
    expect(heading.compareDocumentPosition(photo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(photo.compareDocumentPosition(paragraphs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('assigns each piece its own named grid area, so the lg layout (see globals.css) can move the photo independently', async () => {
    render(await AboutSection())

    expect(screen.getByRole('heading', { name: 'About' })).toHaveClass('about-title')
    for (const photo of screen.getAllByAltText(/glowing Poké Ball/)) {
      expect(photo.closest('.about-photo')).not.toBeNull()
    }
    // Both paragraphs share one grid area (see the note on about-section.tsx
    // for why), so the class lives on their shared wrapper, not on either
    // <p> itself.
    expect(screen.getByText(/I started figuring out/).closest('.about-para')).not.toBeNull()
  })

  it('renders a plain, uncropped photo below lg and a cropped-from-the-top `fill` photo at lg+, one hidden at each breakpoint', async () => {
    render(await AboutSection())

    const [mobilePhoto, lgPhoto] = screen.getAllByAltText(/glowing Poké Ball/)

    // Below lg: a plain sized <img>, at its native 1200×1800 (2:3) ratio —
    // see the note on about-section.tsx for why a plain <img> (rather than
    // a `fill` image) is what's needed for max-w-full to actually shrink
    // it on narrow screens. lg:hidden hides it once the lg variant takes
    // over.
    expect(mobilePhoto).toHaveAttribute('width', '460')
    expect(mobilePhoto).toHaveAttribute('height', '690')
    expect(mobilePhoto).toHaveClass('lg:hidden')
    expect(mobilePhoto.closest('.about-photo')).toBe(mobilePhoto)

    // At lg+: a `fill` image (no width/height attributes) inside a
    // `hidden lg:block` wrapper carrying the .about-photo class instead —
    // object-bottom crops the excess off the *top* of the photo once the
    // wrapper stretches to the para row's own height (.about-photo's
    // align-self: stretch in globals.css), rather than the photo's own
    // full height growing that row to match, as a plain <img> would.
    expect(lgPhoto).not.toHaveAttribute('width')
    expect(lgPhoto).not.toHaveAttribute('height')
    expect(lgPhoto).toHaveClass('object-cover')
    expect(lgPhoto).toHaveClass('object-bottom')
    const lgWrapper = lgPhoto.closest('.about-photo') as HTMLElement
    expect(lgWrapper).not.toBe(lgPhoto)
    expect(lgWrapper).toHaveClass('hidden')
    expect(lgWrapper).toHaveClass('lg:block')
  })

  it('applies text-wrap: pretty to the paragraphs, so the browser avoids leaving a lone word on the last line', async () => {
    render(await AboutSection())

    expect(screen.getByText(/I started figuring out/).closest('.about-para')).toHaveClass(
      'text-pretty'
    )
  })

  it('renders the childhood-origin paragraph before the Swapmeat paragraph, both in the shared grid area', async () => {
    render(await AboutSection())

    const wrapper = screen.getByText(/I started figuring out/).closest('.about-para') as HTMLElement
    const paragraphs = wrapper.querySelectorAll('p')

    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].textContent).toMatch(/^I started figuring out/)
    expect(paragraphs[1].textContent).toMatch(/^Fast-forwarding to my professional career/)
  })

  it('links "Swapmeat on Steam" in the second paragraph to its Steam store page, opened in a new tab', async () => {
    render(await AboutSection())

    const link = screen.getByRole('link', { name: 'Swapmeat on Steam' })
    expect(link).toHaveAttribute('href', 'https://store.steampowered.com/app/2790700/SWAPMEAT/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link.closest('p')?.textContent).toMatch(
      /^Fast-forwarding to my professional career, I shipped Swapmeat on Steam, localized in 6 languages\./
    )
  })

  it('renders the six team sprites, left-aligned above the heading, in the same order ProjectsSection used to', async () => {
    const { container } = render(await AboutSection())

    const sprites = container.querySelectorAll('img[src*="/sprites/"]')
    expect(sprites).toHaveLength(12)
    expect(
      Array.from(sprites)
        .slice(0, 6)
        .map((img) => img.getAttribute('src'))
    ).toEqual([
      'https://example.com/sprites/typhlosion-hisui.png',
      'https://example.com/sprites/ceruledge.png',
      'https://example.com/sprites/annihilape.png',
      'https://example.com/sprites/basculegion-female.png',
      'https://example.com/sprites/froslass.png',
      'https://example.com/sprites/golurk.png',
    ])
  })

  it('mirrors Ceruledge, Annihilape, Basculegion, and Golurk in the top row, leaving the other two unflipped', async () => {
    const { container } = render(await AboutSection())

    const flipped = ['ceruledge', 'annihilape', 'basculegion-female', 'golurk']
    const unflipped = ['typhlosion-hisui', 'froslass']

    for (const name of flipped) {
      const img = container.querySelector(`img[src*="${name}"]`) as HTMLElement
      expect(img.style.transform).toBe('scaleX(-1)')
    }
    for (const name of unflipped) {
      const img = container.querySelector(`img[src*="${name}"]`) as HTMLElement
      expect(img.style.transform).toBe('')
    }
  })

  it('renders the six opponent sprites at the bottom, right-aligned, in the same left-to-right order ProjectsSection used to pair them', async () => {
    const { container } = render(await AboutSection())

    const sprites = Array.from(container.querySelectorAll('img[src*="/sprites/"]')).slice(6)
    expect(sprites.map((img) => img.getAttribute('src'))).toEqual([
      'https://example.com/sprites/charizard.png',
      'https://example.com/sprites/milotic.png',
      'https://example.com/sprites/archaludon.png',
      'https://example.com/sprites/serperior.png',
      'https://example.com/sprites/skeledirge.png',
      'https://example.com/sprites/garchomp.png',
    ])

    const bottomRow = container.querySelector('img[src*="charizard"]')?.parentElement
    expect(bottomRow).toHaveClass('justify-end')
    // mt-14 rather than mt-6 — pushed down an extra line's worth of space
    // below the paragraph above it.
    expect(bottomRow).toHaveClass('mt-14')
  })

  it('renders without crashing, and without the missing sprite, when PokeAPI fails for one Pokémon', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('froslass')) return { ok: false }
        return mockPokeApiFetch()(url)
      })
    )

    const { container } = render(await AboutSection())
    expect(container.querySelectorAll('img[src*="/sprites/"]')).toHaveLength(11)
    expect(container.querySelector('img[src*="froslass"]')).not.toBeInTheDocument()
  })
})

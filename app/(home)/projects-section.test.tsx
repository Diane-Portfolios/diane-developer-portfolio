import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PillRow, ProjectsSection } from './projects-section'

// PillRow and ProjectsSection are both async Server Components — that's
// necessary in the real app (PillRow awaits PokeAPI, ProjectsSection reads
// blog posts from disk), but it means neither can be rendered through a
// plain client render() the way a normal component can: React's client
// renderer doesn't support async function components outside the RSC
// pipeline. PillRow is called directly and awaited below, which works
// because its *own* body has no further async descendants once resolved —
// its ProjectLabel child holds an unrendered <CustomMDX> in a closed modal,
// which React never has to invoke unless that modal opens (untested here).
// ProjectsSection's tree, by contrast, contains six live <PillRow> element
// descriptors — invoking all of them would hit the same problem one level
// down — so that suite instead walks the awaited element tree as plain
// data and asserts on each PillRow descriptor's props directly, without
// ever rendering them.

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

describe('PillRow', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockPokeApiFetch())
  })

  it('renders the matched post\'s title as the clickable label', async () => {
    const element = await PillRow({
      leftPokemon: 'typhlosion-hisui',
      rightPokemon: 'charizard',
      projectSlug: 'wonderbot-1000',
      subtitle: 'An automated social media scraper',
    })
    render(element)

    expect(screen.getByRole('button', { name: /Wonderbot-1000/ })).toBeInTheDocument()
    expect(screen.getByText('An automated social media scraper')).toBeInTheDocument()
  })

  it('uses titleOverride for display instead of the post\'s own frontmatter title, when given', async () => {
    const element = await PillRow({
      leftPokemon: 'ceruledge',
      rightPokemon: 'milotic',
      flipLeftSprite: true,
      projectSlug: 'playswapmeat',
      titleOverride: 'Playswapmeat.com',
      subtitle: 'Marketing website for Swapmeat, by One More Game',
    })
    render(element)

    expect(screen.getByRole('button', { name: /Playswapmeat\.com/ })).toBeInTheDocument()
    expect(screen.queryByText('Playswapmeat', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('fetches and renders both official-artwork sprites, flipping only the left one when asked', async () => {
    const element = await PillRow({
      leftPokemon: 'ceruledge',
      rightPokemon: 'milotic',
      flipLeftSprite: true,
      projectSlug: 'playswapmeat',
      subtitle: 'Marketing website for Swapmeat, by One More Game',
    })
    const { container } = render(element)

    const sprites = container.querySelectorAll('img[src*="/sprites/"]')
    expect(sprites).toHaveLength(2)

    const left = container.querySelector('img[src*="ceruledge"]') as HTMLElement
    const right = container.querySelector('img[src*="milotic"]') as HTMLElement
    expect(left.style.transform).toBe('scaleX(-1)')
    expect(right.style.transform).toBe('')
  })

  it('renders both Poké Ball icons hidden below sm (visible again from sm up), alongside both sprites', async () => {
    const element = await PillRow({
      leftPokemon: 'typhlosion-hisui',
      rightPokemon: 'charizard',
      projectSlug: 'wonderbot-1000',
      subtitle: 'An automated social media scraper',
    })
    const { container } = render(element)

    // jsdom doesn't evaluate media queries, so "hidden below sm" is checked
    // via the classes themselves rather than a computed/visible style.
    const balls = container.querySelectorAll('img[src*="poke-ball"]')
    expect(balls).toHaveLength(2)
    for (const ball of balls) {
      expect(ball).toHaveClass('hidden')
      expect(ball).toHaveClass('sm:block')
    }

    expect(container.querySelectorAll('img[src*="/sprites/"]')).toHaveLength(2)
    expect(container.querySelectorAll('img')).toHaveLength(4)
  })

  it('renders without a sprite (but without crashing) when PokeAPI fails for one side', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('nonexistent-pokemon')) {
          return { ok: false }
        }
        return mockPokeApiFetch()(url)
      })
    )

    const element = await PillRow({
      leftPokemon: 'nonexistent-pokemon',
      rightPokemon: 'charizard',
      projectSlug: 'wonderbot-1000',
      subtitle: 'An automated social media scraper',
    })
    const { container } = render(element)

    expect(container.querySelector('img[src*="nonexistent-pokemon"]')).not.toBeInTheDocument()
    expect(container.querySelector('img[src*="charizard"]')).toBeInTheDocument()
  })

  it('renders no title/label at all when projectSlug matches no post', async () => {
    const element = await PillRow({
      leftPokemon: 'typhlosion-hisui',
      rightPokemon: 'charizard',
      projectSlug: 'not-a-real-post',
      subtitle: 'An automated social media scraper',
    })
    render(element)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

// Walks a (possibly nested/array-valued) React element tree collecting every
// element of the given component type, in document order — used instead of
// rendering, since ProjectsSection's tree contains further async
// descendants (see the note above).
function findAllByType(node: unknown, type: unknown, found: any[] = []): any[] {
  if (node == null || typeof node !== 'object') return found
  if (Array.isArray(node)) {
    for (const child of node) findAllByType(child, type, found)
    return found
  }
  const el = node as { type?: unknown; props?: { children?: unknown } }
  if (el.type === type) found.push(el)
  if (el.props?.children !== undefined) findAllByType(el.props.children, type, found)
  return found
}

describe('ProjectsSection composition', () => {
  it('wires up the six pills to the requested projects, in the requested order', async () => {
    const element = await ProjectsSection()
    expect((element as any).props.id).toBe('projects')

    const pillRows = findAllByType(element, PillRow)
    const slugs = pillRows.map((row) => row.props.projectSlug)

    expect(slugs).toEqual([
      'wonderbot-1000',
      'playswapmeat',
      'house-ops',
      'moonbob-money',
      'laango-django',
      'apre-method',
    ])
  })

  it('wires up the requested subtitle for each pill, and the title override for Playswapmeat.com', async () => {
    const element = await ProjectsSection()
    const pillRows = findAllByType(element, PillRow)
    const bySlug = Object.fromEntries(pillRows.map((row) => [row.props.projectSlug, row.props]))

    expect(bySlug['wonderbot-1000'].subtitle).toBe('An automated social media scraper')
    expect(bySlug['playswapmeat'].subtitle).toBe(
      'Marketing website for Swapmeat, by One More Game'
    )
    expect(bySlug['playswapmeat'].titleOverride).toBe('Playswapmeat.com')
    expect(bySlug['house-ops'].subtitle).toBe('Automated household manager')
    expect(bySlug['moonbob-money'].subtitle).toBe('I created crypto and named it after my cat')
    expect(bySlug['laango-django'].subtitle).toBe(
      'A scheduling service for translation and interpreting agencies'
    )
    expect(bySlug['apre-method'].subtitle).toBe('A calculated approach to progressive overload')
  })

  it('flips the same left sprites that were deliberately flipped for facing/alignment', async () => {
    const element = await ProjectsSection()
    const pillRows = findAllByType(element, PillRow)
    const flips = pillRows.map((row) => [row.props.projectSlug, !!row.props.flipLeftSprite])

    expect(flips).toEqual([
      ['wonderbot-1000', false],
      ['playswapmeat', true],
      ['house-ops', true],
      ['moonbob-money', true],
      ['laango-django', false],
      ['apre-method', true],
    ])
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { extractOverview, ProjectTile, ProjectsSection } from './projects-section'

// ProjectTile and ProjectsSection are both async Server Components — that's
// necessary in the real app (ProjectsSection reads blog posts from disk),
// but it means neither can be rendered through a plain client render() the
// way a normal component can: React's client renderer doesn't support async
// function components outside the RSC pipeline. ProjectTile is called
// directly and awaited below, which works because its *own* body has no
// further async descendants once resolved — its ProjectLabel child holds an
// unrendered <CustomMDX> in a closed modal, which React never has to invoke
// unless that modal opens (untested here). ProjectsSection's tree, by
// contrast, contains six live <ProjectTile> element descriptors — invoking
// all of them would hit the same problem one level down — so that suite
// instead walks the awaited element tree as plain data and asserts on each
// ProjectTile descriptor's props directly, without ever rendering them.

describe('extractOverview', () => {
  it('pulls just the Overview section\'s paragraph out of a post\'s MDX content', () => {
    const content = `[**GitHub Link**](https://example.com)
<br />

## **Overview**
This is the overview paragraph.
<br />

## **How It Works**
This part should not be included.
<br />
`
    expect(extractOverview(content)).toBe('This is the overview paragraph.')
  })

  it('returns an empty string when there is no Overview section', () => {
    expect(extractOverview('## **How It Works**\nSomething else entirely.')).toBe('')
  })
})

describe('ProjectTile', () => {
  it('renders the matched post\'s title and overview as the clickable label', async () => {
    const element = await ProjectTile({ projectSlug: 'wonderbot-1000' })
    render(element)

    expect(screen.getByRole('button', { name: /Wonderbot-1000/ })).toBeInTheDocument()
    expect(screen.getByText(/scrapes One More Game's social media channels/)).toBeInTheDocument()
  })

  it('uses titleOverride for display instead of the post\'s own frontmatter title, when given', async () => {
    const element = await ProjectTile({
      projectSlug: 'playswapmeat',
      titleOverride: 'Playswapmeat.com',
    })
    render(element)

    expect(screen.getByRole('button', { name: /Playswapmeat\.com/ })).toBeInTheDocument()
    expect(screen.queryByText('Playswapmeat', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('renders no title/label at all when projectSlug matches no post', async () => {
    const element = await ProjectTile({ projectSlug: 'not-a-real-post' })
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
  it('wires up the six tiles to the requested projects, in the requested order', async () => {
    const element = await ProjectsSection()
    expect((element as any).props.id).toBe('projects')

    const tiles = findAllByType(element, ProjectTile)
    const slugs = tiles.map((tile) => tile.props.projectSlug)

    expect(slugs).toEqual([
      'union-shift-coverage',
      'house-ops',
      'wonderbot-1000',
      'moonbob-money',
      'playswapmeat',
      'laango-django',
    ])
  })

  it('wires up the title override for Playswapmeat.com', async () => {
    const element = await ProjectsSection()
    const tiles = findAllByType(element, ProjectTile)
    const bySlug = Object.fromEntries(tiles.map((tile) => [tile.props.projectSlug, tile.props]))

    expect(bySlug['playswapmeat'].titleOverride).toBe('Playswapmeat.com')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PillRow, ProjectsSection } from './projects-section'

// PillRow and ProjectsSection are both async Server Components — that's
// necessary in the real app (ProjectsSection reads blog posts from disk),
// but it means neither can be rendered through a plain client render() the
// way a normal component can: React's client renderer doesn't support async
// function components outside the RSC pipeline. PillRow is called directly
// and awaited below, which works because its *own* body has no further
// async descendants once resolved — its ProjectLabel child holds an
// unrendered <CustomMDX> in a closed modal, which React never has to invoke
// unless that modal opens (untested here). ProjectsSection's tree, by
// contrast, contains six live <PillRow> element descriptors — invoking all
// of them would hit the same problem one level down — so that suite instead
// walks the awaited element tree as plain data and asserts on each PillRow
// descriptor's props directly, without ever rendering them.

describe('PillRow', () => {
  it('renders the matched post\'s title as the clickable label', async () => {
    const element = await PillRow({
      projectSlug: 'wonderbot-1000',
      subtitle: 'An automated social media scraper',
    })
    render(element)

    expect(screen.getByRole('button', { name: /Wonderbot-1000/ })).toBeInTheDocument()
    expect(screen.getByText('An automated social media scraper')).toBeInTheDocument()
  })

  it('uses titleOverride for display instead of the post\'s own frontmatter title, when given', async () => {
    const element = await PillRow({
      projectSlug: 'playswapmeat',
      titleOverride: 'Playswapmeat.com',
      subtitle: 'Marketing website for Swapmeat, by One More Game',
    })
    render(element)

    expect(screen.getByRole('button', { name: /Playswapmeat\.com/ })).toBeInTheDocument()
    expect(screen.queryByText('Playswapmeat', { selector: 'h3' })).not.toBeInTheDocument()
  })

  it('renders no title/label at all when projectSlug matches no post', async () => {
    const element = await PillRow({
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
})

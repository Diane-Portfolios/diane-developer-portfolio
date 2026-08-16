import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Code, CustomLink, RoundedImage, Table, createHeading, slugify } from './mdx'

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('How It Works')).toBe('how-it-works')
  })

  it('replaces & with "and"', () => {
    expect(slugify('Rock & Roll')).toBe('rock-and-roll')
  })

  it('strips punctuation other than hyphens', () => {
    expect(slugify("Why I Built It / How I Use It")).toBe('why-i-built-it-how-i-use-it')
  })

  it('collapses runs of hyphens into one', () => {
    expect(slugify('a---b')).toBe('a-b')
  })
})

describe('CustomLink', () => {
  it('renders internal links (starting with /) as a next/link', () => {
    render(<CustomLink href="/old-site/blog/apre-method">Read more</CustomLink>)
    const link = screen.getByRole('link', { name: 'Read more' })
    expect(link).toHaveAttribute('href', '/old-site/blog/apre-method')
    // next/link shouldn't force target=_blank on an in-app navigation.
    expect(link).not.toHaveAttribute('target')
  })

  it('renders hash links as a plain anchor with no target/rel added', () => {
    render(<CustomLink href="#overview">Overview</CustomLink>)
    const link = screen.getByRole('link', { name: 'Overview' })
    expect(link).toHaveAttribute('href', '#overview')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders external links with target=_blank and rel=noopener noreferrer', () => {
    render(<CustomLink href="https://github.com/dianestephani">GitHub</CustomLink>)
    const link = screen.getByRole('link', { name: 'GitHub' })
    expect(link).toHaveAttribute('href', 'https://github.com/dianestephani')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('createHeading', () => {
  it('renders the requested heading level with a slugified id and a leading anchor link', () => {
    const H2 = createHeading(2)
    render(<H2>How It Works</H2>)
    const heading = screen.getByRole('heading', { level: 2, name: 'How It Works' })
    expect(heading.tagName).toBe('H2')
    expect(heading).toHaveAttribute('id', 'how-it-works')

    const anchor = heading.querySelector('a.anchor')
    expect(anchor).toHaveAttribute('href', '#how-it-works')
  })

  it('slugifies differently-worded headings to different ids', () => {
    const H2 = createHeading(2)
    const { rerender } = render(<H2>Overview</H2>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'overview')

    rerender(<H2>Why I Built It / How I Use It</H2>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
      'id',
      'why-i-built-it-how-i-use-it'
    )
  })
})

describe('RoundedImage', () => {
  it('passes alt and other props through to the underlying image, with rounded corners', () => {
    render(<RoundedImage src="/assets/foo.png" alt="A screenshot" width={400} height={300} />)
    const img = screen.getByRole('img', { name: 'A screenshot' })
    expect(img).toHaveClass('rounded-lg')
  })
})

describe('Code', () => {
  it('renders the given code text inside a <code> element', () => {
    render(<Code>const x = 1</Code>)
    // sugar-high syntax-highlights into spans, so the text may be split
    // across children — assert on the element's overall text content rather
    // than exact markup.
    const code = document.querySelector('code')
    expect(code).not.toBeNull()
    expect(code!.textContent).toBe('const x = 1')
  })
})

describe('Table', () => {
  it('renders one header cell per header and one row per data row', () => {
    render(
      <Table
        data={{
          headers: ['Name', 'Slug'],
          rows: [
            ['Wonderbot-1000', 'wonderbot-1000'],
            ['Playswapmeat', 'playswapmeat'],
          ],
        }}
      />
    )
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Slug' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Wonderbot-1000' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // header row + 2 data rows
  })
})

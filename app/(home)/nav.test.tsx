import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TITLE_PREFIX } from './cycle-phrases'
import { SiteNav } from './nav'

describe('SiteNav', () => {
  it('renders home/about/experience/projects/contact as same-page anchor links, in that order', () => {
    render(<SiteNav />)
    const nav = screen.getByRole('navigation')
    const links = within(nav).getAllByRole('link')

    expect(links.map((l) => l.textContent)).toEqual([
      'home',
      'about',
      'experience',
      'projects',
      'contact',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '#home',
      '#about',
      '#experience',
      '#projects',
      '#contact',
    ])
  })

  it('places the name/title before the links in the DOM, so it heads the stack below sm', () => {
    render(<SiteNav />)
    const title = screen.getByText(TITLE_PREFIX, { exact: false })
    const firstLink = screen.getAllByRole('link')[0]

    expect(title.compareDocumentPosition(firstLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it("flips the title back below the links via order classes at sm, since the DOM order alone would put it first everywhere", () => {
    render(<SiteNav />)
    // getByText matches CyclingTitle's inner "text-white" span (the
    // immediate text-holding element); its parent is CyclingTitle's own
    // root span, which is what nav.tsx's order-1/sm:order-2 classes land on.
    const titleRoot = screen.getByText(TITLE_PREFIX, { exact: false }).parentElement!

    expect(titleRoot).toHaveClass('order-1')
    expect(titleRoot).toHaveClass('sm:order-2')
  })

  it('gives the name/title distinct weight from the links below sm, so it reads as a header rather than another link', () => {
    render(<SiteNav />)
    const titleRoot = screen.getByText(TITLE_PREFIX, { exact: false }).parentElement!

    expect(titleRoot).toHaveClass('font-semibold')
    expect(titleRoot).toHaveClass('border-b')
  })
})

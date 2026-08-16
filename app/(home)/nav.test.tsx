import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
})

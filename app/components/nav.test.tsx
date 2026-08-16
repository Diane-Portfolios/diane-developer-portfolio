import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Navbar, navItems } from './nav'

describe('navItems', () => {
  it('points at the old site\'s own /old-site-prefixed routes, not the homepage\'s', () => {
    expect(navItems).toEqual({
      '/old-site/blog': { name: 'projects' },
    })
  })
})

describe('Navbar', () => {
  it('renders one link per navItems entry, pointing at the right path', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'projects' })).toHaveAttribute(
      'href',
      '/old-site/blog'
    )
  })
})

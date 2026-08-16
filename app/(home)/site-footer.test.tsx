import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './site-footer'

describe('SiteFooter', () => {
  it('links to rss, github, and view source', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: /rss/ })).toHaveAttribute('href', '/rss')
    expect(screen.getByRole('link', { name: /github/ })).toHaveAttribute(
      'href',
      'https://github.com/dianestephani'
    )
    expect(screen.getByRole('link', { name: /view source/ })).toHaveAttribute(
      'href',
      'https://vercel.com/templates/next.js/portfolio-starter-kit'
    )
  })

  it('shows the current year in the copyright line', () => {
    render(<SiteFooter />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${year} MIT Licensed`))).toBeInTheDocument()
  })
})

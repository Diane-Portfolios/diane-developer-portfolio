import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlogPosts } from './posts'

describe('BlogPosts', () => {
  it('links each post to its /old-site/blog/<slug> page, not the old bare /blog path', () => {
    render(<BlogPosts />)
    const link = screen.getByRole('link', { name: /The APRE Method/ })
    expect(link).toHaveAttribute('href', '/old-site/blog/apre-method')
  })

  it('sorts posts newest-first by publishedAt', () => {
    render(<BlogPosts />)
    const links = screen.getAllByRole('link')
    const titles = links.map((l) => l.textContent)

    // wonderbot-1000 (2026-05-27) is the most recently published post in the
    // real posts directory; apre-method (2025-10-20) is one of the oldest —
    // so the former must render before the latter under newest-first sort.
    const wonderbotIndex = titles.findIndex((t) => t?.includes('Wonderbot-1000'))
    const apreIndex = titles.findIndex((t) => t?.includes('The APRE Method'))
    expect(wonderbotIndex).toBeGreaterThanOrEqual(0)
    expect(apreIndex).toBeGreaterThanOrEqual(0)
    expect(wonderbotIndex).toBeLessThan(apreIndex)
  })
})

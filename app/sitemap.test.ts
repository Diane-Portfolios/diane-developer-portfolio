// @vitest-environment node
import { describe, expect, it } from 'vitest'
import sitemap, { baseUrl } from './sitemap'

describe('sitemap', () => {
  it('lists the homepage and the old blog index under /old-site, not the pre-migration /blog', async () => {
    const urls = (await sitemap()).map((e) => e.url)
    expect(urls).toContain(baseUrl)
    expect(urls).toContain(`${baseUrl}/old-site/blog`)
    expect(urls).not.toContain(`${baseUrl}/blog`)
  })

  it('every blog post URL is prefixed with /old-site/blog/, matching where those posts actually live now', async () => {
    const entries = await sitemap()
    const postEntries = entries.filter((e) => e.url.includes('/blog/') && !e.url.endsWith('/blog'))

    expect(postEntries.length).toBeGreaterThan(0)
    for (const entry of postEntries) {
      expect(entry.url).toMatch(new RegExp(`^${baseUrl}/old-site/blog/[^/]+$`))
    }
  })

  it('includes a known post at its real, current URL', async () => {
    const entries = await sitemap()
    expect(entries.map((e) => e.url)).toContain(`${baseUrl}/old-site/blog/apre-method`)
  })
})

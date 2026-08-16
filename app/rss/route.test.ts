// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { baseUrl } from '../sitemap'
import { GET } from './route'

describe('GET /rss', () => {
  it('serves XML with each post linked at its real, current /old-site/blog/<slug> URL', async () => {
    const res = await GET()
    expect(res.headers.get('Content-Type')).toBe('text/xml')

    const xml = await res.text()
    expect(xml).toContain(`<link>${baseUrl}/old-site/blog/apre-method</link>`)
    // Guards against regressing back to the pre-migration bare /blog/ path.
    expect(xml).not.toContain(`<link>${baseUrl}/blog/`)
  })

  it('includes the channel-level link pointing at the site root', async () => {
    const res = await GET()
    const xml = await res.text()
    expect(xml).toContain(`<link>${baseUrl}</link>`)
  })
})

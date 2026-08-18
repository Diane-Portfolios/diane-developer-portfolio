import { CustomMDX } from '../components/mdx'
import { formatDate, getBlogPosts } from '../old-site/blog/utils'
import { ProjectLabel } from './project-label'
import { ScrollReveal } from './scroll-reveal'

// Every post's MDX body follows the same "## **Overview**" heading pattern
// (see any file in app/old-site/blog/posts/*.mdx) — this pulls just that
// paragraph out so the tile face can show a real excerpt instead of a
// hand-written subtitle, while the full post (all sections) still opens in
// ProjectLabel's popup on click. Exported for direct testing.
export function extractOverview(content: string): string {
  const match = content.match(/##\s*\*{0,2}Overview\*{0,2}\s*\n([\s\S]*?)(?:\n##\s|$)/)
  if (!match) return ''
  return match[1]
    .replace(/<br\s*\/?>/g, '')
    .trim()
}

// One project tile — the template. The poke-ball+sprite pairs that used to
// flank each pill live in AboutSection now instead (see the note there), so
// this is just the tile and its title/overview.
//
// projectSlug looks the post up from the old site's own blog posts
// (app/old-site/blog/posts/*.mdx) via the same getBlogPosts() that site
// still uses — one real source of content instead of a second copy. The full
// post — title, date, and MDX body the old blog page rendered — opens in
// ProjectLabel's popup on click; the tile face shows just the title and the
// post's own Overview paragraph (see extractOverview above).
//
// titleOverride is deliberately separate from the post's own frontmatter
// title: in Playswapmeat's case it wants a different display title than the
// post's own — without touching that post's real title, which old-site's
// blog pages/sitemap/RSS still use as-is.
// Exported (in addition to being used internally by ProjectsSection) so it's
// directly testable — as an async Server Component it can only be invoked as
// a plain function and awaited, not rendered via JSX through a normal client
// render tree.
export async function ProjectTile({
  projectSlug,
  titleOverride,
}: {
  projectSlug: string
  titleOverride?: string
}) {
  const post = getBlogPosts().find((p) => p.slug === projectSlug)

  return (
    <>
      {post && (
        <ProjectLabel
          title={titleOverride ?? post.metadata.title}
          overview={extractOverview(post.content)}
          dateLabel={formatDate(post.metadata.publishedAt)}
        >
          <CustomMDX source={post.content} />
        </ProjectLabel>
      )}
    </>
  )
}

// All six project tiles, on their own plain black section below
// ExperienceSection, with the "Projects" title right above the grid —
// text-right to keep the About/Experience/Projects alternation going (About
// right, Experience left, Projects right) now that Projects has its own
// section again rather than sharing ExperienceSection's row.
export async function ProjectsSection() {
  return (
    // id="projects" is the nav's anchor target; scroll-mt-24 clears the fixed
    // nav the same way Experience's does.
    <section id="projects" className="relative scroll-mt-24 bg-black">
      {/* Same max-w-6xl / px rhythm as the nav and the About section, so this
          lines up with them horizontally. pt-24/pb-24: symmetric now that the
          heading lives in here again, matching the breathing room the bottom
          edge always had. */}
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <ScrollReveal className="text-right">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h2>
        </ScrollReveal>

        {/* Each tile gets its own ScrollReveal rather than one wrapping the
            whole grid — that made every tile appear at once the moment the
            top of the grid crossed into view. Individual observers mean each
            tile fades in independently right as it crosses the threshold, so
            they render one-by-one while the visitor scrolls down them. */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ScrollReveal>
            <ProjectTile projectSlug="union-shift-coverage" />
          </ScrollReveal>

          {/* Household OS's post file is named house-ops.mdx. */}
          <ScrollReveal>
            <ProjectTile projectSlug="house-ops" />
          </ScrollReveal>

          <ScrollReveal>
            <ProjectTile projectSlug="wonderbot-1000" />
          </ScrollReveal>

          <ScrollReveal>
            <ProjectTile projectSlug="moonbob-money" />
          </ScrollReveal>

          {/* titleOverride: "Playswapmeat.com" for the tile/modal display —
              the post's own frontmatter title ("Playswapmeat") stays as-is,
              still used by old-site's blog listing/page/sitemap/RSS. */}
          <ScrollReveal>
            <ProjectTile projectSlug="playswapmeat" titleOverride="Playswapmeat.com" />
          </ScrollReveal>

          {/* Laango Scheduling Service's post file is named laango-django.mdx. */}
          <ScrollReveal>
            <ProjectTile projectSlug="laango-django" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

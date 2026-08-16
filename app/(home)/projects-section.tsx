import { CustomMDX } from '../components/mdx'
import { formatDate, getBlogPosts } from '../old-site/blog/utils'
import { ProjectLabel } from './project-label'
import { ScrollReveal } from './scroll-reveal'

// One title pill — the template. The poke-ball+sprite pairs that used to
// flank each pill live in AboutSection now instead (see the note there), so
// this is just the pill and its title/subtitle.
//
// projectSlug looks the post up from the old site's own blog posts
// (app/old-site/blog/posts/*.mdx) via the same getBlogPosts() that site
// still uses — one real source of content instead of a second copy. The full
// post — title, date, and MDX body the old blog page rendered — opens in
// ProjectLabel's popup on click.
//
// subtitle and titleOverride are deliberately separate from the post's own
// frontmatter (title/summary): the pill wants a short, punchy line distinct
// from the blog post's own formal summary, and in Playswapmeat's case a
// different display title than the post's own — without touching that post's
// real title, which old-site's blog pages/sitemap/RSS still use as-is.
// Exported (in addition to being used internally by ProjectsSection) so it's
// directly testable — as an async Server Component it can only be invoked as
// a plain function and awaited, not rendered via JSX through a normal client
// render tree.
export async function PillRow({
  projectSlug,
  subtitle,
  titleOverride,
}: {
  projectSlug: string
  subtitle: string
  titleOverride?: string
}) {
  const post = getBlogPosts().find((p) => p.slug === projectSlug)

  return (
    <div className="flex w-full justify-center">
      {/* Translucent white rather than translucent black: the section
          behind it is already pure black, so an actual black fill at any
          opacity would stay black and the pill would disappear. White at
          low opacity is the standard way to get a visible "frosted dark
          grey" panel against a black backdrop. */}
      {post && (
        <div className="rounded-full bg-white/15 px-8 py-4 text-center sm:px-10 sm:py-5">
          <ProjectLabel
            title={titleOverride ?? post.metadata.title}
            subtitle={subtitle}
            dateLabel={formatDate(post.metadata.publishedAt)}
          >
            <CustomMDX source={post.content} />
          </ProjectLabel>
        </div>
      )}
    </div>
  )
}

// All six Pokémon pill rows, on their own plain black section below
// ExperienceSection, with the "Projects" title right above the first pill —
// text-right to keep the About/Experience/Projects alternation going (About
// right, Experience left, Projects right) now that Projects has its own
// section again rather than sharing ExperienceSection's row. Each pill's
// title and subtitle are real project content now (see projectSlug/subtitle
// on PillRow).
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

        {/* Each pill gets its own ScrollReveal rather than one wrapping the
            whole list — that made every row appear at once the moment the
            top of the list crossed into view. Individual observers mean each
            row fades in independently right as it crosses the threshold, so
            they render one-by-one while the visitor scrolls down them.
            w-full on the wrapper matters: without it the wrapper (now the
            actual flex child) shrinks to fit content under this container's
            items-start, and PillRow's own w-full inside it would have
            nothing to be 100% of. items-start still reads as centred — every
            pill is w-full, so cross-axis alignment never actually shows. */}
        <div className="mt-8 flex flex-col items-start gap-8 sm:gap-4">
          <ScrollReveal className="w-full">
            <PillRow projectSlug="wonderbot-1000" subtitle="An automated social media scraper" />
          </ScrollReveal>

          {/* titleOverride: "Playswapmeat.com" for the pill/modal display —
              the post's own frontmatter title ("Playswapmeat") stays as-is,
              still used by old-site's blog listing/page/sitemap/RSS. */}
          <ScrollReveal className="w-full">
            <PillRow
              projectSlug="playswapmeat"
              titleOverride="Playswapmeat.com"
              subtitle="Marketing website for Swapmeat, by One More Game"
            />
          </ScrollReveal>

          {/* Household OS's post file is named house-ops.mdx. */}
          <ScrollReveal className="w-full">
            <PillRow projectSlug="house-ops" subtitle="Automated household manager" />
          </ScrollReveal>

          <ScrollReveal className="w-full">
            <PillRow
              projectSlug="moonbob-money"
              subtitle="I created crypto and named it after my cat"
            />
          </ScrollReveal>

          {/* Laango Scheduling Service's post file is named laango-django.mdx. */}
          <ScrollReveal className="w-full">
            <PillRow
              projectSlug="laango-django"
              subtitle="A scheduling service for translation and interpreting agencies"
            />
          </ScrollReveal>

          <ScrollReveal className="w-full">
            <PillRow
              projectSlug="apre-method"
              subtitle="A calculated approach to progressive overload"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

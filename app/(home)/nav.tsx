import { CyclingTitle } from './cycling-title'

// Anchors into this same page's sections, not routes — the whole site is one
// scrolling page now, so clicking any of these just scrolls rather than
// navigating. Plain <a href="#..."> rather than next/link's <Link>: there's
// no route to prefetch or transition to, and a bare anchor keeps same-page
// scrolling working even with JS disabled (scroll-behavior/scroll-margin-top
// in globals.css do the rest). "home" targets the hero itself, which starts
// at the literal top of the page — no scroll-margin-top there, unlike the
// other sections, so it lands at true page-top rather than nav-offset.
const SITE_NAV_ITEMS = [
  { id: 'home', name: 'home' },
  { id: 'about', name: 'about' },
  { id: 'experience', name: 'experience' },
  { id: 'projects', name: 'projects' },
  { id: 'contact', name: 'contact' },
]

// Mirrors the structure and spacing of the old site's navbar, recoloured for
// a black background.
//
// Wider than the old max-w-xl column: the settled title is ~430px on its own, so
// links and title can't share a 576px row without colliding.
export function SiteNav() {
  return (
    // Fixed rather than in flow, so it stays put once the hero scrolls away.
    // Opaque black because it now sits over the background photo: the image
    // starts at the top of the hero and this bar covers it, which reads exactly
    // as the background beginning beneath the navbar — and avoids pinning the
    // layout to a hardcoded nav height, which differs between the stacked
    // mobile layout and the single desktop row.
    <nav className="fixed inset-x-0 top-0 z-30 bg-black tracking-tight">
      {/* The whole row fades in together — the rotating title included, now
          that a slot runs long enough for the entrance not to eat into it. */}
      <div className="ns-enter-nav mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="-ml-[8px] flex flex-row">
          {SITE_NAV_ITEMS.map(({ id, name }) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative m-1 flex px-2 py-1 align-middle text-white transition-all hover:text-neutral-400"
            >
              {name}
            </a>
          ))}
        </div>
        {/* Nudged in from the right edge to give the longest phrases room. */}
        <CyclingTitle className="text-xs sm:mr-[1cm] sm:text-base md:text-lg" />
      </div>
    </nav>
  )
}

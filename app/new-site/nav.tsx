import Link from 'next/link'
import { navItems } from '../components/nav'
import { CyclingTitle } from './cycling-title'

// Mirrors the structure and spacing of the current site's navbar, recoloured for
// a black background. It's a separate component rather than a prop on the
// original so the redesign can diverge freely without touching the live site.
//
// Wider than the old max-w-xl column: the settled title is ~430px on its own, so
// links and title can't share a 576px row without colliding.
export function NewSiteNav() {
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
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="relative m-1 flex px-2 py-1 align-middle text-white transition-all hover:text-neutral-400"
            >
              {name}
            </Link>
          ))}
        </div>
        {/* Nudged in from the right edge to give the longest phrases room. */}
        <CyclingTitle className="text-xs sm:mr-[1cm] sm:text-base md:text-lg" />
      </div>
    </nav>
  )
}

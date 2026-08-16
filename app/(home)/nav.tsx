import { CyclingTitle } from './cycling-title'
import { NavLinks } from './nav-links'

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
        {/* order-1 at every breakpoint: below sm the name/title reads as a
            heading for the links underneath it, and at sm+ it's now the
            left-anchored element, so it comes first visually in both
            layouts. A border under it only below sm gives it a distinct
            "header" weight instead of reading as just another nav item.
            Weight is no longer set here — CyclingTitle bolds its own name
            line and keeps the role line normal-weight internally, so the
            two stay visually distinct regardless of what this className
            sets. */}
        <CyclingTitle className="order-1 mb-2 border-b border-white/10 pb-3 text-base sm:mb-0 sm:border-none sm:pb-0 sm:text-base md:text-lg" />
        <NavLinks />
      </div>
    </nav>
  )
}

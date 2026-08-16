'use client'

import { useEffect, useState } from 'react'

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

const ACTIVE_GLOW = {
  color: 'rgb(216 180 254)', // purple-300
  textShadow: '0 0 8px rgba(192,132,252,0.85), 0 0 16px rgba(192,132,252,0.45)',
}

// Highlights whichever section is currently in view, whether the visitor got
// there by clicking one of these links or by plain scrolling — both just
// move the page, and this only cares where it ends up, not how. An
// IntersectionObserver watching a thin band just below the fixed nav, rather
// than a scroll listener: cheap (doesn't run on every scroll frame), and it
// naturally tracks "whichever section's top most recently crossed into
// view" without hand-rolled scroll-position math — clicking a link scrolls
// the page natively, and that scroll re-triggers the same observer, so there
// is only one code path to keep in sync rather than a separate click handler
// racing the scroll one.
export function NavLinks() {
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const sections = SITE_NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      // Shrinks the observed area to a band just under the fixed nav (-100px
      // top) down to the top 30% of the viewport (-70% bottom) — a section
      // only becomes "current" once its top has scrolled up past the nav,
      // not the moment it first peeks in at the bottom of the screen.
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    )

    for (const el of sections) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    // Tighter margin/padding/text below sm: at the default size all 5 links
    // ran wider than a narrow phone screen and clipped past the edge.
    // flex-wrap as a last resort, not the primary fix — the tighter sizing
    // already fits every phone width tested; wrap just means an unusually
    // large system font never re-introduces the clip. order-2 at every
    // breakpoint keeps the links right-anchored after the title.
    <div className="order-2 -ml-1.5 flex flex-row flex-wrap sm:-ml-[8px] sm:flex-nowrap">
      {SITE_NAV_ITEMS.map(({ id, name }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={id === activeId ? 'location' : undefined}
          className="relative m-0.5 flex px-1.5 py-1 align-middle text-sm text-white transition-all hover:text-neutral-400 sm:m-1 sm:px-2 sm:text-base"
          style={id === activeId ? ACTIVE_GLOW : undefined}
        >
          {name}
        </a>
      ))}
    </div>
  )
}

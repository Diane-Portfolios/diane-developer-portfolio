import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Site',
  description: 'Work-in-progress redesign of Diane Stephani’s portfolio.',
  // Keep the redesign out of search results until it replaces the live site.
  robots: { index: false, follow: false },
}

// Deliberately empty chrome. No width cap, no nav, no footer — build the new
// design's shell here as it takes shape.
export default function NewSiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Scroll-reveal blocks (scroll-reveal.tsx) start at opacity 0 and need
          JS — an IntersectionObserver — to ever become visible. Every other
          entrance animation on this page is pure CSS and works with JS off;
          this is the one exception, so it gets an explicit fallback rather
          than silently losing content for JS-disabled visitors. */}
      <noscript>
        <style>{`.ns-reveal { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      {children}
    </div>
  )
}

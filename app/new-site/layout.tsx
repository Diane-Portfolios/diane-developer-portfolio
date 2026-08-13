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
  return <div className="min-h-screen">{children}</div>
}

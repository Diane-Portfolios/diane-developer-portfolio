'use client'

import { useEffect, useRef, useState } from 'react'

// Fades and slides a block in the first time it scrolls into view, then leaves
// it alone — a one-time reveal, not a toggle that replays on scroll-back.
// IntersectionObserver rather than a scroll listener: it doesn't run on every
// scroll frame, and unlike `animation-timeline: view()` (which would be the
// no-JS way to do this) it works on Safari today rather than failing silently
// on older versions — this site already has one Safari gap (AV1 video) and
// doesn't need a second.
export function ScrollReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Fires a bit before the block fully enters, and only once it's crossed
      // some way into the viewport rather than right at the bottom edge.
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      // Hidden/visible states and the reduced-motion override live in
      // globals.css (.ns-reveal) — this component only ever toggles the one
      // modifier class, so a reduced-motion visitor never depends on JS
      // running correctly to see the content.
      className={`ns-reveal ${visible ? 'ns-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

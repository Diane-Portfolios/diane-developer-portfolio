'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// The clickable project tile — title and overview blurb — and the popup it
// opens with the full write-up. title/overview/dateLabel are plain strings
// and `children` is the project's MDX content already rendered server-side
// (CustomMDX is an RSC — it can't run in this client component) — the caller
// renders it and passes the result down, same pattern as passing any other
// Server Component output into a Client Component.
export function ProjectLabel({
  title,
  overview,
  dateLabel,
  children,
}: {
  title: string
  overview?: string
  dateLabel: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    // Esc closes it, and body scroll is locked while it's open so the page
    // behind the modal doesn't scroll along with the modal's own content.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // flex flex-col items-start: overrides the browser default of
        // vertically centering a <button>'s content, so title/overview stay
        // pinned to the top of the tile instead of drifting toward its
        // middle on rows where a sibling tile's longer overview stretches
        // every tile in the row taller.
        className="flex h-full w-full cursor-pointer flex-col items-start rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]"
      >
        <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h3>
        {overview && <p className="mt-3 text-sm leading-relaxed text-neutral-400">{overview}</p>}
      </button>

      {/* Portaled to document.body rather than rendered in place: the tile
          grid sits in a normal stacking context, but portaling still keeps
          this escaping any ancestor stacking context that might otherwise
          put it under the nav's z-30. */}
      {open &&
        createPortal(
          // Backdrop click closes; the panel stops that click from bubbling
          // so clicking inside the content doesn't also close it.
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-5 text-left text-white sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 text-2xl leading-none text-neutral-400 transition-colors hover:text-white"
              >
                ×
              </button>

              <h3 className="pr-8 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{dateLabel}</p>

              <article className="prose prose-invert mt-6">{children}</article>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

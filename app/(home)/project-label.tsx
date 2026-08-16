'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// The clickable project title in a pill's centre, and the popup it opens.
// title/dateLabel are plain strings and `children` is the project's MDX
// content already rendered server-side (CustomMDX is an RSC — it can't run
// in this client component) — PillRow renders it and passes the result down,
// same pattern as passing any other Server Component output into a Client
// Component.
export function ProjectLabel({
  title,
  dateLabel,
  children,
}: {
  title: string
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
      {/* Same hover glow/scale the placeholder label had, now on a real
          button so it's keyboard-operable too. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-center transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.75)]"
      >
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
      </button>

      {/* Portaled to document.body rather than rendered in place: PillRow's
          row wrapper sets z-10 with position:relative, which creates its own
          stacking context — a fixed descendant's z-index is then compared
          only against siblings *inside* that context, not globally, so a
          plain z-50 here would still end up visually under the nav's z-30
          (and swallow clicks near the top of the screen behind it). A portal
          escapes that ancestor entirely. */}
      {open &&
        createPortal(
          // Backdrop click closes; the panel stops that click from bubbling
          // so clicking inside the content doesn't also close it.
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-8 text-left text-white"
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

              <h3 className="pr-8 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{dateLabel}</p>

              <article className="prose prose-invert mt-6">{children}</article>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

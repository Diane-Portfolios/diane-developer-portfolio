import Link from 'next/link'

export default function NewSitePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        Work in progress
      </p>
      <h1 className="text-4xl font-semibold tracking-tighter sm:text-6xl">
        New Site
      </h1>
      <p className="max-w-lg text-neutral-600 dark:text-neutral-300">
        Blank canvas for the redesign. This page has its own layout — full
        width, no navbar, no footer — so nothing here is constrained by the
        current site.
      </p>
      <Link
        href="/"
        className="text-sm text-neutral-600 underline decoration-neutral-400 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:text-neutral-100"
      >
        back to the current site
      </Link>
    </div>
  )
}

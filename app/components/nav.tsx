import Link from 'next/link'

// This is the old site's own nav now — the redesign graduated to the real
// homepage (app/(home)) and has its own anchor-based nav. The old home and
// contact pages are gone (superseded by the new site's own About/Experience
// and ContactSection), leaving only the blog, which still needs a way back to
// its own listing from an individual post.
export const navItems = {
  '/old-site/blog': {
    name: 'projects',
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}

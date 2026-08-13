import Link from 'next/link'
import { navItems } from '../components/nav'

// Mirrors the structure and spacing of the current site's navbar, recoloured for
// a black background. It's a separate component rather than a prop on the
// original so the redesign can diverge freely without touching the live site.
export function NewSiteNav() {
  return (
    <nav className="ns-enter-nav absolute inset-x-0 top-0 z-20 tracking-tight">
      <div className="mx-auto max-w-xl px-2 pt-8 md:px-0">
        <div className="-ml-[8px] flex flex-row space-x-0">
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
      </div>
    </nav>
  )
}

// Same links and copyright as the old site's footer (app/components/footer.tsx)
// — reused rather than invented, since it's still accurate — restyled for
// this page's permanently dark theme rather than that one's light/dark toggle
// (its text-neutral-600 dark:text-neutral-300 would render as dim, low-
// contrast text here on a light-mode system, since this page never actually
// switches to light mode itself).
function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Plain black, no background photo — sits right after Contact's photo cuts
// off, so this is what the page actually ends on.
export function SiteFooter() {
  return (
    <footer className="relative bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ul className="font-sm flex flex-col space-x-0 space-y-2 text-neutral-400 md:flex-row md:space-x-4 md:space-y-0">
          <li>
            <a
              className="flex items-center transition-all hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
              href="/rss"
            >
              <ArrowIcon />
              <p className="ml-2 h-7">rss</p>
            </a>
          </li>
          <li>
            <a
              className="flex items-center transition-all hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/dianestephani"
            >
              <ArrowIcon />
              <p className="ml-2 h-7">github</p>
            </a>
          </li>
          <li>
            <a
              className="flex items-center transition-all hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
              href="https://vercel.com/templates/next.js/portfolio-starter-kit"
            >
              <ArrowIcon />
              <p className="ml-2 h-7">view source</p>
            </a>
          </li>
        </ul>
        <p className="mt-8 text-neutral-400">
          © {new Date().getFullYear()} MIT Licensed
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Pokémon images via PokéAPI, © Nintendo/Game Freak
        </p>
      </div>
    </footer>
  )
}

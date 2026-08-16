// No metadata export here — this route group is the site's homepage now, so
// it just inherits the root layout's title/description/robots (indexed,
// followed) rather than overriding them.
//
// Deliberately empty chrome otherwise. No width cap, no nav, no footer beyond
// what the page itself renders.
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh">
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

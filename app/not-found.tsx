// Global 404 for URLs that match no route group, so it renders against the bare
// root layout and carries its own container. In-site 404s use old-site/not-found.tsx.
export default function NotFound() {
  return (
    <div className="max-w-xl mx-4 mt-8 lg:mx-auto">
      <section className="mt-6 px-2 md:px-0">
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          404 - Page Not Found
        </h1>
        <p className="mb-4">The page you are looking for does not exist.</p>
      </section>
    </div>
  )
}

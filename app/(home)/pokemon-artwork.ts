// Looks up a Pokémon's official-artwork PNG on PokeAPI. Shared by
// ProjectsSection (pill sprites) and AboutSection (mini sprite row) — both
// need the same "fetch, then tolerate PokeAPI being unreachable at build
// time" behavior, so it lives here once rather than twice.
export async function getPokemonArtworkUrl(name: string): Promise<string | null> {
  try {
    // PokeAPI data for a given Pokémon is effectively static, so the default
    // fetch caching (cached indefinitely for a statically rendered route) is
    // exactly right — no need to refetch this on every build.
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.sprites?.other?.['official-artwork']?.front_default ?? null
  } catch {
    // Build-time network hiccup, PokeAPI down, whatever — callers should
    // still render without the sprite rather than fail the page.
    return null
  }
}

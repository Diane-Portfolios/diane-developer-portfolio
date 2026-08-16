import { describe, expect, it, vi } from 'vitest'
import { getPokemonArtworkUrl } from './pokemon-artwork'

// Both AboutSection and ProjectsSection's PillRow consume this indirectly,
// but only exercise the "ok" and "ok: false" branches between them — the
// thrown-exception and malformed-response branches only exist because of
// this file's own try/catch and optional chaining, so they're covered here
// directly instead.
describe('getPokemonArtworkUrl', () => {
  it('requests the given Pokémon by name and returns its official-artwork URL', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        sprites: {
          other: { 'official-artwork': { front_default: 'https://example.com/golurk.png' } },
        },
      }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const url = await getPokemonArtworkUrl('golurk')

    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/golurk')
    expect(url).toBe('https://example.com/golurk.png')
  })

  it('returns null when PokeAPI responds but not with ok:true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })))
    expect(await getPokemonArtworkUrl('missingno')).toBeNull()
  })

  it('returns null, without throwing, when fetch itself rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      })
    )
    await expect(getPokemonArtworkUrl('golurk')).resolves.toBeNull()
  })

  it('returns null when the response is ok but missing the official-artwork field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ sprites: {} }) }))
    )
    expect(await getPokemonArtworkUrl('golurk')).toBeNull()
  })
})

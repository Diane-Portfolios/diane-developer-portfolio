import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NavLinks } from './nav-links'

const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'contact']

// Same pattern as scroll-reveal.test.tsx: the global setup's
// IntersectionObserver stub is a no-op, but this component's whole behavior
// lives in its callback, so these tests capture and manually fire it.
let observeSpy: ReturnType<typeof vi.fn>
let disconnectSpy: ReturnType<typeof vi.fn>
let capturedCallback: IntersectionObserverCallback | null = null
let capturedOptions: IntersectionObserverInit | undefined

beforeEach(() => {
  observeSpy = vi.fn()
  disconnectSpy = vi.fn()
  capturedCallback = null
  capturedOptions = undefined

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        capturedCallback = callback
        capturedOptions = options
      }
      observe = observeSpy
      disconnect = disconnectSpy
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
      root = null
      rootMargin = ''
      thresholds: ReadonlyArray<number> = []
    }
  )

  // The real page renders one <section id="..."> per nav item (see
  // page.tsx and each *-section.tsx); NavLinks finds them via
  // document.getElementById, so the test DOM needs the same targets.
  for (const id of SECTION_IDS) {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  for (const id of SECTION_IDS) {
    document.getElementById(id)?.remove()
  }
})

function fireIntersection(id: string) {
  act(() => {
    capturedCallback?.(
      [{ isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  })
}

function link(name: string) {
  return screen.getByRole('link', { name })
}

describe('NavLinks', () => {
  it('renders all 5 section links, home active by default', () => {
    render(<NavLinks />)
    for (const name of ['home', 'about', 'experience', 'projects', 'contact']) {
      expect(link(name)).toBeInTheDocument()
    }
    expect(link('home')).toHaveAttribute('aria-current', 'location')
  })

  it('observes every section it found in the DOM', () => {
    render(<NavLinks />)
    expect(observeSpy).toHaveBeenCalledTimes(SECTION_IDS.length)
  })

  it('watches a band just below the fixed nav, not the whole viewport', () => {
    render(<NavLinks />)
    expect(capturedOptions).toEqual({ rootMargin: '-100px 0px -70% 0px', threshold: 0 })
  })

  it('moves the glow to whichever section crosses into the band', () => {
    render(<NavLinks />)

    fireIntersection('experience')

    expect(link('experience')).toHaveAttribute('aria-current', 'location')
    expect(link('home')).not.toHaveAttribute('aria-current')
    expect(link('experience')).toHaveStyle({ color: 'rgb(216 180 254)' })
    expect(link('home')).not.toHaveStyle({ color: 'rgb(216 180 254)' })
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<NavLinks />)
    unmount()
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
  })

  it('does nothing (no crash, no observer) if the sections are not on the page', () => {
    for (const id of SECTION_IDS) {
      document.getElementById(id)?.remove()
    }
    expect(() => render(<NavLinks />)).not.toThrow()
    expect(observeSpy).not.toHaveBeenCalled()
  })
})

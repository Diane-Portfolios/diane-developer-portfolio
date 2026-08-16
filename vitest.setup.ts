import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// next/font/google downloads and self-hosts a real font at build time — not
// meaningful in a test environment, and network access shouldn't be a
// dependency of running the suite. Every next/font/* call returns this same
// shape (className + style), so one mock covers whichever font a component
// imports.
vi.mock('next/font/google', () => ({
  Press_Start_2P: () => ({ className: 'mock-pixel-font', style: {} }),
}))

// jsdom doesn't implement IntersectionObserver at all — ScrollReveal's whole
// reveal-on-scroll behavior depends on it, so tests that exercise it provide
// their own instance via this mock and trigger it manually.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// jsdom implements matchMedia's shape inconsistently across versions and
// doesn't evaluate real media queries — GameBoyScreen listens for
// prefers-reduced-motion, so it needs a stable, always-present stand-in.
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
)

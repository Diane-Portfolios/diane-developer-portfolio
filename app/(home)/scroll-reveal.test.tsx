import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollReveal } from './scroll-reveal'

// The global setup's IntersectionObserver stub is a no-op — fine for
// components that merely construct one, but this component's entire
// behavior lives in its callback, so these tests need to capture and
// manually fire it to simulate a scroll crossing the threshold.
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
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function fireIntersection(isIntersecting: boolean) {
  act(() => {
    capturedCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  })
}

describe('ScrollReveal', () => {
  it('starts hidden (ns-reveal, no ns-reveal-visible) and observes its own element', () => {
    render(
      <ScrollReveal>
        <p>content</p>
      </ScrollReveal>
    )
    const wrapper = screen.getByText('content').parentElement!
    expect(wrapper).toHaveClass('ns-reveal')
    expect(wrapper).not.toHaveClass('ns-reveal-visible')
    expect(observeSpy).toHaveBeenCalledWith(wrapper)
  })

  it('observes with a threshold that fires before the block fully enters', () => {
    render(<ScrollReveal>x</ScrollReveal>)
    expect(capturedOptions).toEqual({ threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
  })

  it('adds ns-reveal-visible once it intersects, and disconnects (one-time reveal)', () => {
    render(
      <ScrollReveal>
        <p>content</p>
      </ScrollReveal>
    )
    const wrapper = screen.getByText('content').parentElement!

    fireIntersection(true)

    expect(wrapper).toHaveClass('ns-reveal-visible')
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
  })

  it('does nothing while not yet intersecting', () => {
    render(
      <ScrollReveal>
        <p>content</p>
      </ScrollReveal>
    )
    const wrapper = screen.getByText('content').parentElement!

    fireIntersection(false)

    expect(wrapper).not.toHaveClass('ns-reveal-visible')
    expect(disconnectSpy).not.toHaveBeenCalled()
  })

  it('appends a custom className alongside the reveal classes', () => {
    render(
      <ScrollReveal className="text-right">
        <p>content</p>
      </ScrollReveal>
    )
    const wrapper = screen.getByText('content').parentElement!
    expect(wrapper).toHaveClass('ns-reveal')
    expect(wrapper).toHaveClass('text-right')
  })

  it('disconnects the observer on unmount even if it never intersected', () => {
    const { unmount } = render(<ScrollReveal>x</ScrollReveal>)
    unmount()
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
  })
})

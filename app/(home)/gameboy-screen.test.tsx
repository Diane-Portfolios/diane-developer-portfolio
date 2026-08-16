import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GameBoyControls } from './gameboy-controls'
import { GameBoyScreen } from './gameboy-screen'
import { LanguageProvider } from './language-context'

// jsdom's HTMLMediaElement.play() throws "not implemented" — the
// reduced-motion path never calls it (only .pause()), which is what makes
// that path the one worth testing here without media-API mocking.
function mockReducedMotion() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  )
}

describe('GameBoyScreen (prefers-reduced-motion)', () => {
  let playSpy: ReturnType<typeof vi.spyOn>
  let pauseSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion()

    // jsdom doesn't implement play()/pause() at all (play() throws "not
    // implemented"). React runs every mount effect once before processing
    // the setReduced() state update from the first one, so even on the
    // reduced-motion path, the second effect's *first* pass still briefly
    // sees the initial reduced=false and calls play() — a real one-tick
    // quirk of the component, not a testing artifact — before its own
    // cleanup and the immediate re-render correct it to the reduced path.
    playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    pauseSpy = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    playSpy.mockRestore()
    pauseSpy.mockRestore()
  })

  it('renders the video and the menu overlay, with the menu hidden until the hold elapses', () => {
    const { container } = render(
      <LanguageProvider>
        <GameBoyScreen />
      </LanguageProvider>
    )

    expect(container.querySelector('video')).toBeInTheDocument()
    const menuWrapper = container.querySelector('video')!.nextElementSibling as HTMLElement
    expect(menuWrapper.style.opacity).toBe('0')
  })

  it('reveals the menu (crossfades in) after the hold duration', () => {
    const { container } = render(
      <LanguageProvider>
        <GameBoyScreen />
      </LanguageProvider>
    )
    const menuWrapper = container.querySelector('video')!.nextElementSibling as HTMLElement

    // HOLD_MS is 3000 in the component; advancing well past it should be
    // enough regardless of the exact constant without hardcoding it here.
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(menuWrapper.style.opacity).toBe('1')
  })

  it('cleans up its timer on unmount without throwing', () => {
    const { unmount } = render(
      <LanguageProvider>
        <GameBoyScreen />
      </LanguageProvider>
    )
    expect(() => unmount()).not.toThrow()
  })

  it('enables the D-pad/B overlay only once the hold elapses and the menu is showing', () => {
    const { getByRole } = render(
      <LanguageProvider>
        <GameBoyScreen />
        <GameBoyControls />
      </LanguageProvider>
    )
    const upButton = getByRole('button', { name: /move language selection up/i })
    expect(upButton).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(upButton).not.toBeDisabled()
  })
})

'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LANGUAGES } from './languages'

// Column-major, 5 rows — matches GameBoyMenu's 2-col/5-row grid exactly,
// since LANGUAGES is that grid's own source order (English first).
const ROWS = 5

type Direction = 'up' | 'down' | 'left' | 'right'

type ContextValue = {
  language: string
  controlsEnabled: boolean
  setControlsEnabled: (enabled: boolean) => void
  move: (direction: Direction) => void
  reset: () => void
}

const LanguageContext = createContext<ContextValue | null>(null)

// Site-wide language state. There's no separate "menu cursor" — the D-pad
// moves `language` directly, so whichever row it lands on is immediately
// what the nav/paragraph/location text show. English is the default and B's
// reset target: no auto-rotation, nothing changes until the console is used.
export function LanguageProvider({
  children,
  initialLanguage = 'en',
  // Test-only escape hatch: the real page only flips this via
  // GameBoyScreen's boot-sequence timer, but tests that want to exercise
  // move()/reset() directly shouldn't have to fake-timer their way through
  // the intro video first.
  initialControlsEnabled = false,
}: {
  children: ReactNode
  initialLanguage?: string
  initialControlsEnabled?: boolean
}) {
  const [language, setLanguage] = useState(initialLanguage)
  const [controlsEnabled, setControlsEnabled] = useState(initialControlsEnabled)

  const move = useCallback((direction: Direction) => {
    setLanguage((current) => {
      const index = LANGUAGES.findIndex((l) => l.lang === current)
      const col = Math.floor(index / ROWS)
      const row = index % ROWS

      // Clamped, not wrapped — pressing past an edge just holds there.
      const nextCol = direction === 'left' ? Math.max(0, col - 1)
        : direction === 'right' ? Math.min(1, col + 1)
        : col
      const nextRow = direction === 'up' ? Math.max(0, row - 1)
        : direction === 'down' ? Math.min(ROWS - 1, row + 1)
        : row

      return LANGUAGES[nextCol * ROWS + nextRow].lang
    })
  }, [])

  const reset = useCallback(() => setLanguage('en'), [])

  const value = useMemo(
    () => ({ language, controlsEnabled, setControlsEnabled, move, reset }),
    [language, controlsEnabled, move, reset]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useLanguageContext(): ContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage/useGameBoyControls must be used within a LanguageProvider')
  return ctx
}

// Read-only consumers — the nav title, about paragraph, location note, menu.
export function useLanguage(): { language: string } {
  const { language } = useLanguageContext()
  return { language }
}

// The D-pad/B overlay only.
export function useGameBoyControls(): Omit<ContextValue, 'setControlsEnabled'> & {
  setControlsEnabled: (enabled: boolean) => void
} {
  return useLanguageContext()
}

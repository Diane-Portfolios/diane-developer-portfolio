import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GameBoyMenu } from './gameboy-menu'
import { LANGUAGES } from './languages'

describe('GameBoyMenu', () => {
  it('renders the LANGUAGE title and one row per language, in its own script', () => {
    render(<GameBoyMenu />)
    expect(screen.getByText('LANGUAGE')).toBeInTheDocument()

    for (const { native } of LANGUAGES) {
      expect(screen.getByText(native)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('listitem')).toHaveLength(LANGUAGES.length)
  })
})

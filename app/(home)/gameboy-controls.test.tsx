import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ROLE_BY_LANG } from './cycle-phrases'
import { CyclingTitle } from './cycling-title'
import { GameBoyControls } from './gameboy-controls'
import { GameBoyMenu } from './gameboy-menu'
import { LanguageProvider } from './language-context'

// The real integration surface: a click on the console's D-pad should show
// up immediately, together, on both the nav title and the menu's own
// cursor — proving the "keep everything synced" requirement end to end
// rather than unit-testing each piece against a mocked context value.
function renderConsole(initialControlsEnabled = true) {
  return render(
    <LanguageProvider initialControlsEnabled={initialControlsEnabled}>
      <CyclingTitle />
      <GameBoyMenu />
      <GameBoyControls />
    </LanguageProvider>
  )
}

function button(name: RegExp) {
  return screen.getByRole('button', { name })
}

describe('GameBoyControls', () => {
  it('defaults everything to English, with no auto-rotation', () => {
    renderConsole()
    expect(screen.getByText(ROLE_BY_LANG.en)).toBeInTheDocument()
  })

  it('moving the D-pad right, then down, lands on and shows a specific language everywhere at once', async () => {
    const user = userEvent.setup()
    renderConsole()

    // LANGUAGES column-major, 5 rows: col 0 = English/es/fr/pt/it, col 1 =
    // de/cs/ja/zh-Hans/ko. Right then down twice lands on col 1 row 2 = 'ja'.
    await user.click(button(/move language selection right/i))
    await user.click(button(/move language selection down/i))
    await user.click(button(/move language selection down/i))

    expect(screen.getByText(ROLE_BY_LANG.ja)).toBeInTheDocument()
    const jaRow = screen.getByText('日本語').closest('li')!
    expect(jaRow.querySelector('[aria-hidden="true"]')).toHaveStyle({ opacity: '1' })
  })

  it('clamps at the grid edges instead of wrapping', async () => {
    const user = userEvent.setup()
    renderConsole()

    // Already at the top-left (English) — up and left should both no-op.
    await user.click(button(/move language selection up/i))
    await user.click(button(/move language selection left/i))

    expect(screen.getByText(ROLE_BY_LANG.en)).toBeInTheDocument()
  })

  it('B resets the language back to English', async () => {
    const user = userEvent.setup()
    renderConsole()

    await user.click(button(/move language selection right/i))
    expect(screen.queryByText(ROLE_BY_LANG.en)).not.toBeInTheDocument()

    await user.click(button(/reset language to english/i))
    expect(screen.getByText(ROLE_BY_LANG.en)).toBeInTheDocument()
  })

  it('is inert until controlsEnabled is true (boot sequence not finished)', async () => {
    const user = userEvent.setup()
    renderConsole(false)

    for (const btn of screen.getAllByRole('button')) {
      expect(btn).toBeDisabled()
    }

    await user.click(button(/move language selection right/i))
    expect(screen.getByText(ROLE_BY_LANG.en)).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GameBoyMenu } from './gameboy-menu'
import { LanguageProvider } from './language-context'
import { LANGUAGES } from './languages'

function renderMenu(initialLanguage?: string) {
  return render(
    <LanguageProvider initialLanguage={initialLanguage}>
      <GameBoyMenu />
    </LanguageProvider>
  )
}

describe('GameBoyMenu', () => {
  it('renders the LANGUAGE title and one row per language, in its own script', () => {
    renderMenu()
    expect(screen.getByText('LANGUAGE')).toBeInTheDocument()

    for (const { native } of LANGUAGES) {
      expect(screen.getByText(native)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('listitem')).toHaveLength(LANGUAGES.length)
  })

  it('leads with an English row, distinct from the translated rows', () => {
    renderMenu()
    const items = screen.getAllByRole('listitem')

    expect(LANGUAGES[0]).toEqual({ en: 'English', native: 'English', lang: 'en' })
    expect(items[0]).toHaveTextContent('English')
  })

  it('lays the list out in a 2-column, 5-row grid — 10 rows no longer fit one column', () => {
    renderMenu()
    const list = screen.getAllByRole('listitem')[0].parentElement!

    expect(list).toHaveStyle({ gridTemplateColumns: 'repeat(2, 1fr)' })
    expect(list).toHaveStyle({ gridTemplateRows: 'repeat(5, 1fr)' })
  })

  it('gives every row a cursor element, so the indent stays aligned regardless of which is active', () => {
    renderMenu()
    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(LANGUAGES.length)
    for (const item of items) {
      expect(item.querySelector('[aria-hidden="true"]')).not.toBeNull()
    }
  })

  it("only the currently-selected row's cursor is visible", () => {
    renderMenu('ja')

    const jaItem = screen.getByText('日本語').closest('li')!
    const enItem = screen.getByText('English').closest('li')!

    expect(jaItem.querySelector('[aria-hidden="true"]')).toHaveStyle({ opacity: '1' })
    expect(enItem.querySelector('[aria-hidden="true"]')).toHaveStyle({ opacity: '0' })
  })
})

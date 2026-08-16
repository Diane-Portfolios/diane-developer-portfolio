import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROLE_BY_LANG, TITLE_PREFIX } from './cycle-phrases'
import { CyclingTitle } from './cycling-title'
import { LanguageProvider } from './language-context'
import { LANGUAGES } from './languages'

function renderTitle(initialLanguage?: string) {
  return render(
    <LanguageProvider initialLanguage={initialLanguage}>
      <CyclingTitle />
    </LanguageProvider>
  )
}

describe('CyclingTitle', () => {
  it('renders the static name prefix plus the English role by default', () => {
    renderTitle()
    expect(screen.getByText(TITLE_PREFIX, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(ROLE_BY_LANG.en)).toBeInTheDocument()
  })

  it("renders whichever language's role the provider is seeded with", () => {
    for (const { lang } of LANGUAGES) {
      const { unmount } = renderTitle(lang)
      expect(screen.getByText(ROLE_BY_LANG[lang])).toBeInTheDocument()
      unmount()
    }
  })

  it('stacks the name above the role at every breakpoint', () => {
    renderTitle()
    const titleRoot = screen.getByText(TITLE_PREFIX, { exact: false }).parentElement!

    expect(titleRoot).toHaveClass('flex-col')
    expect(titleRoot).not.toHaveClass('sm:flex-row')
  })

  it('bolds the name and keeps the role normal-weight, so the two read as distinct lines', () => {
    renderTitle()
    const nameEl = screen.getByText(TITLE_PREFIX, { exact: false })
    const roleEl = screen.getByText(ROLE_BY_LANG.en)

    expect(nameEl).toHaveClass('font-bold')
    expect(roleEl).toHaveClass('font-normal')
  })

  it('marks non-English roles with a lang attribute; English carries none', () => {
    const fr = renderTitle('fr')
    expect(screen.getByText(ROLE_BY_LANG.fr)).toHaveAttribute('lang', 'fr')
    fr.unmount()

    renderTitle('en')
    expect(screen.getByText(ROLE_BY_LANG.en)).not.toHaveAttribute('lang')
  })
})

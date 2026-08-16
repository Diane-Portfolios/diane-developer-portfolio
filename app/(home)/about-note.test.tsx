import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutNote } from './about-note'
import { LanguageProvider } from './language-context'
import { LANGUAGES } from './languages'

function renderNote(initialLanguage?: string) {
  return render(
    <LanguageProvider initialLanguage={initialLanguage}>
      <AboutNote />
    </LanguageProvider>
  )
}

describe('AboutNote', () => {
  it('renders the name, static across languages', () => {
    renderNote()
    expect(screen.getByRole('heading', { name: 'Diane Stephani' })).toBeInTheDocument()
  })

  it('renders the English about paragraph by default', () => {
    renderNote()
    expect(screen.getByText(/software engineer with a background in games/)).toBeInTheDocument()
  })

  it("renders every language's about paragraph when the provider is seeded with it", () => {
    for (const { lang } of LANGUAGES) {
      const { container, unmount } = renderNote(lang)
      const para = container.querySelector('p')!
      expect(para.textContent?.length).toBeGreaterThan(0)
      unmount()
    }
  })
})

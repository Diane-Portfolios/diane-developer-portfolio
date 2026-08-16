import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from './language-context'
import { LocationNote } from './location-note'

function renderNote(initialLanguage?: string) {
  return render(
    <LanguageProvider initialLanguage={initialLanguage}>
      <LocationNote />
    </LanguageProvider>
  )
}

describe('LocationNote', () => {
  it('renders the English label and place names by default', () => {
    renderNote()
    expect(screen.getByText('I work in')).toBeInTheDocument()
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument()
    expect(screen.getByText('Chicago, IL')).toBeInTheDocument()
  })

  it('declines the place names into Czech only when Czech is selected', () => {
    renderNote('cs')
    expect(screen.getByText('Pracuji')).toBeInTheDocument()
    expect(screen.getByText('v Seattlu')).toBeInTheDocument()
    expect(screen.getByText('v Chicagu')).toBeInTheDocument()
    expect(screen.queryByText('Seattle, WA')).not.toBeInTheDocument()
  })

  it("shows another language's label without touching the (undeclined) place names", () => {
    renderNote('fr')
    expect(screen.getByText('Je travaille à')).toBeInTheDocument()
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument()
    expect(screen.getByText('Chicago, IL')).toBeInTheDocument()
  })
})

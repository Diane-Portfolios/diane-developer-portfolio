import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutNote } from './about-note'
import { LANG_ORDER } from './rotation'

describe('AboutNote', () => {
  it('renders the name, static across languages', () => {
    render(<AboutNote />)
    expect(screen.getByRole('heading', { name: 'Diane Stephani' })).toBeInTheDocument()
  })

  it('renders the English about paragraph by default, visible to assistive tech', () => {
    render(<AboutNote />)
    const para = screen.getByText(/software engineer with a background in games/)

    expect(para.closest('.ns-rot-default')).not.toHaveAttribute('aria-hidden')
  })

  it('renders every other language\'s about paragraph too, but hidden from assistive tech', () => {
    render(<AboutNote />)

    for (const lang of LANG_ORDER) {
      const block = document.querySelector(`.ns-rot[lang="${lang}"]`)
      expect(block).not.toBeNull()
      expect(block).toHaveAttribute('aria-hidden', 'true')
      expect(block?.textContent?.length).toBeGreaterThan(0)
    }
  })
})

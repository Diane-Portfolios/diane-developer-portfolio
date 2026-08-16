import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocationNote } from './location-note'

describe('LocationNote', () => {
  it('renders the English place names by default', () => {
    render(<LocationNote />)
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument()
    expect(screen.getByText('Chicago, IL')).toBeInTheDocument()
  })

  it('renders the Czech-declined place names too, but hidden from assistive tech', () => {
    render(<LocationNote />)
    const seattlu = screen.getByText('v Seattlu')
    const chicagu = screen.getByText('v Chicagu')

    expect(seattlu.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(chicagu.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('the English (non-Czech) place block is not itself aria-hidden', () => {
    render(<LocationNote />)
    const seattle = screen.getByText('Seattle, WA')
    // Its nearest aria-hidden ancestor, if any, must be further up than the
    // dedicated "non-Czech" wrapper — i.e. this block itself isn't hidden.
    const nonCzechWrapper = seattle.closest('.ns-rot-default')!
    expect(nonCzechWrapper).not.toHaveAttribute('aria-hidden')
  })
})

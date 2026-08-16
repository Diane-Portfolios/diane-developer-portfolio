import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutNote } from './about-note'

describe('AboutNote', () => {
  it('renders the name and about paragraph', () => {
    render(<AboutNote />)
    expect(screen.getByRole('heading', { name: 'Diane Stephani' })).toBeInTheDocument()
    expect(screen.getByText(/software engineer with a background in games/)).toBeInTheDocument()
  })
})

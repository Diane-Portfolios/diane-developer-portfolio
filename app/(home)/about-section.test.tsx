import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutSection } from './about-section'

describe('AboutSection', () => {
  it('has id="about", the nav\'s anchor target', () => {
    const { container } = render(<AboutSection />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })

  it('renders the About heading', () => {
    render(<AboutSection />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
  })
})

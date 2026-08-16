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

  it('places the heading, photo, and paragraph in that reading order in the DOM', () => {
    render(<AboutSection />)

    const heading = screen.getByRole('heading', { name: 'About' })
    const photo = screen.getByAltText('Swap Meat on Steam')
    const paragraph = screen.getByText(/I shipped Swapmeat on Steam/)

    // DOCUMENT_POSITION_FOLLOWING means the argument comes *after* the node
    // compareDocumentPosition was called on. This is the DOM/reading order
    // (heading, then photo, then paragraph) — below lg that also happens to
    // be the visual stacking order, but at lg the .about-layout grid (see
    // globals.css) moves the photo to the left of both via CSS grid areas,
    // which jsdom doesn't evaluate; see the class-based test below for that.
    expect(heading.compareDocumentPosition(photo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(photo.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('assigns each piece its own named grid area, so the lg layout (see globals.css) can move the photo independently', () => {
    render(<AboutSection />)

    expect(screen.getByRole('heading', { name: 'About' })).toHaveClass('about-title')
    expect(screen.getByAltText('Swap Meat on Steam')).toHaveClass('about-photo')
    expect(screen.getByText(/I shipped Swapmeat on Steam/)).toHaveClass('about-para')
  })
})

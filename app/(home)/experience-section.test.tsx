import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExperienceSection } from './experience-section'

describe('ExperienceSection', () => {
  it('has id="experience", the nav\'s anchor target', () => {
    const { container } = render(<ExperienceSection />)
    expect(container.querySelector('#experience')).toBeInTheDocument()
  })

  it('renders the Experience heading and its background photo', () => {
    const { container } = render(<ExperienceSection />)
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
    // alt="" is intentional (decorative background photo), which means it
    // has no accessible "img" role — queried directly instead.
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash-retro-desk')
    )
  })

  it('renders the job title, company, dates, and every bullet', () => {
    render(<ExperienceSection />)
    expect(screen.getByRole('heading', { name: 'Software Engineer' })).toBeInTheDocument()
    expect(screen.getByText('One More Game')).toBeInTheDocument()
    expect(screen.getByText('March 2026 – Present')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText(/SWAPMEAT/)).toBeInTheDocument()
  })

  it('puts a semitransparent panel behind the job entries, but not behind the Experience heading itself', () => {
    render(<ExperienceSection />)

    const panel = screen.getByText('One More Game').closest('.bg-black\\/40') as HTMLElement
    expect(panel).not.toBeNull()
    // The job entry (title/company/dates/bullets) lives inside the panel...
    expect(panel).toContainElement(screen.getByRole('heading', { name: 'Software Engineer' }))
    // ...but the section heading above it does not.
    expect(panel).not.toContainElement(screen.getByRole('heading', { name: 'Experience' }))
  })
})

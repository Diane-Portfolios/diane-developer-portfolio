import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactSection } from './contact-section'

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First Name *'), 'Ada')
  await user.type(screen.getByLabelText('Last Name *'), 'Lovelace')
  await user.type(screen.getByLabelText('Email Address *'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message *'), 'Hello there.')
}

describe('ContactSection', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    // Reassigned fresh each test — no matching afterEach cleanup needed, and
    // importantly no vi.unstubAllGlobals() here either: that would also wipe
    // out the global setup's IntersectionObserver stub, which ScrollReveal
    // (wrapping this whole section) needs on every render.
    vi.stubGlobal('fetch', fetchMock)
  })

  it('renders the id used as the nav anchor target, plus the heading and every field', () => {
    const { container } = render(<ContactSection />)
    expect(container.querySelector('#contact')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByLabelText('First Name *')).toBeRequired()
    expect(screen.getByLabelText('Last Name *')).toBeRequired()
    expect(screen.getByLabelText('Email Address *')).toBeRequired()
    expect(screen.getByLabelText('Message *')).toBeRequired()
  })

  it('POSTs the form fields as JSON to /api/contact on submit', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<ContactSection />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        message: 'Hello there.',
      }),
    })
  })

  it('shows a success message and clears the form once the request resolves ok', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<ContactSection />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(
      await screen.findByText("Thank you for your message! I'll get back to you soon.")
    ).toBeInTheDocument()
    expect(screen.getByLabelText('First Name *')).toHaveValue('')
    expect(screen.getByLabelText('Message *')).toHaveValue('')
  })

  it('shows an error message and preserves the form when the response is not ok', async () => {
    fetchMock.mockResolvedValue({ ok: false })
    const user = userEvent.setup()
    render(<ContactSection />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(
      await screen.findByText('Failed to send message. Please try again.')
    ).toBeInTheDocument()
    // Unlike the success path, the visitor's typed message shouldn't
    // disappear on failure — they'd have to retype it to retry.
    expect(screen.getByLabelText('First Name *')).toHaveValue('Ada')
  })

  it('shows an error message when fetch itself rejects (network failure)', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()
    render(<ContactSection />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(
      await screen.findByText('Failed to send message. Please try again.')
    ).toBeInTheDocument()
  })

  it('disables the submit button and shows "Sending..." while the request is in flight', async () => {
    let resolveFetch: (value: { ok: boolean }) => void = () => {}
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    const user = userEvent.setup()
    render(<ContactSection />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    const pendingButton = screen.getByRole('button', { name: 'Sending...' })
    expect(pendingButton).toBeDisabled()

    resolveFetch({ ok: true })
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Send Message' })).not.toBeDisabled()
    )
  })
})

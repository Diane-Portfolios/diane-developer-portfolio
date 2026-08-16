// @vitest-environment node
//
// A route handler runs server-side, not in a browser — testing it against
// jsdom (this project's default test environment) would be testing the
// wrong runtime. This override switches just this file to Vitest's node
// environment, which is what Next actually executes route handlers in.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  // `new Resend(apiKey)` requires a real constructor — a plain arrow
  // function mockImplementation isn't `new`-able.
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } }
  }),
}))

function postRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const validBody = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    message: 'Hello there.',
  }

  beforeEach(() => {
    sendMock.mockReset()
    vi.stubEnv('RESEND_API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects with 400 when a required field is missing', async () => {
    const { POST } = await import('./route')
    const res = await POST(postRequest({ ...validBody, firstName: '' }))

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'All fields are required' })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('sends the email with the expected fields and returns 200 on success', async () => {
    sendMock.mockResolvedValue({ id: 'email_123' })
    const { POST } = await import('./route')

    const res = await POST(postRequest(validBody))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, data: { id: 'email_123' } })

    expect(sendMock).toHaveBeenCalledTimes(1)
    const [sentArgs] = sendMock.mock.calls[0]
    expect(sentArgs.to).toBe('diane.stephani@gmail.com')
    expect(sentArgs.replyTo).toBe('ada@example.com')
    expect(sentArgs.subject).toBe('New Contact Form Message from Ada Lovelace')
    expect(sentArgs.html).toContain('Ada Lovelace')
    expect(sentArgs.html).toContain('Hello there.')
    expect(sentArgs.text).toContain('Hello there.')
  })

  it('returns 500 when Resend throws', async () => {
    sendMock.mockRejectedValue(new Error('Resend is down'))
    const { POST } = await import('./route')

    const res = await POST(postRequest(validBody))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Failed to send email' })
  })

  it('returns 500 (not a crash) when RESEND_API_KEY is unset', async () => {
    vi.unstubAllEnvs()
    delete process.env.RESEND_API_KEY
    const { POST } = await import('./route')

    const res = await POST(postRequest(validBody))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Failed to send email' })
    expect(sendMock).not.toHaveBeenCalled()
  })
})

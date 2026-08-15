'use client'

import { useState } from 'react'
import { ScrollReveal } from './scroll-reveal'

// Same form as the old site's /old-site/contact — same fields, same POST to
// /api/contact, same status handling — restyled for this page's permanently
// dark theme rather than the old page's light/dark toggle (there's no light
// mode here, so no dark: variants needed).
export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    // id="contact" is the nav's anchor target; scroll-mt-24 matches
    // Experience/Projects for the same reason — no other padding here
    // happens to already clear the fixed nav.
    <section id="contact" className="relative scroll-mt-24 bg-black">
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-24 sm:px-6">
        {/* max-w-xl, no ml-auto — text-left continues the About(right) /
            Experience(left) / Projects(right) alternation started above. */}
        <ScrollReveal className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Contact
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Have a question or want to work together? Send me a message and
            I'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full resize-vertical rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            {status === 'success' && (
              <div className="rounded-lg bg-green-900/20 p-4 text-green-200">
                Thank you for your message! I'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-lg bg-red-900/20 p-4 text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROLE_BY_LANG, TITLE_PREFIX } from './cycle-phrases'
import { CyclingTitle } from './cycling-title'
import { SEQUENCE } from './rotation'

describe('CyclingTitle', () => {
  it('renders the static English prefix plus every unique language\'s role text', () => {
    render(<CyclingTitle />)
    expect(screen.getByText(TITLE_PREFIX, { exact: false })).toBeInTheDocument()

    for (const code of new Set(SEQUENCE)) {
      expect(screen.getByText(ROLE_BY_LANG[code])).toBeInTheDocument()
    }
  })

  it('stacks the name above the role at every breakpoint', () => {
    render(<CyclingTitle />)
    const titleRoot = screen.getByText(TITLE_PREFIX, { exact: false }).parentElement!

    expect(titleRoot).toHaveClass('flex-col')
    expect(titleRoot).not.toHaveClass('sm:flex-row')
  })

  it('bolds the name and keeps the role normal-weight, so the two read as distinct lines', () => {
    render(<CyclingTitle />)
    const nameEl = screen.getByText(TITLE_PREFIX, { exact: false })
    const roleStack = document.querySelector('.ns-cycle-stack')!

    expect(nameEl).toHaveClass('font-bold')
    expect(roleStack).toHaveClass('font-normal')
  })

  it('only the English state is exposed to assistive tech; every other language is aria-hidden', () => {
    render(<CyclingTitle />)
    const stack = document.querySelector('.ns-cycle-stack')!
    const states = Array.from(stack.children)

    const english = states.find((s) => s.className.includes('ns-rot-default'))
    const others = states.filter((s) => s !== english)

    expect(english).not.toHaveAttribute('aria-hidden')
    expect(others.length).toBeGreaterThan(0)
    for (const state of others) {
      expect(state).toHaveAttribute('aria-hidden', 'true')
    }
  })
})

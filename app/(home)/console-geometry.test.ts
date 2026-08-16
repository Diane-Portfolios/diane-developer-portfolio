import { describe, expect, it } from 'vitest'
import {
  CONSOLE_ASPECT,
  CONSOLE_BOTTOM_INSET,
  CONSOLE_LEFT_FROM_RIGHT,
  CONSOLE_RIGHT_FROM_LEFT,
  LEFT_COLUMN,
  RIGHT_COLUMN,
  SCREEN_CENTRE_X,
  SCREEN_CENTRE_Y,
  SIDE_TEXT_VISIBLE,
  SIZE,
} from './console-geometry'

// Pulls the multiplier coefficient out of a calc() string, e.g.
// "calc(50vh - 0.6769 * min(73vh, 122vw))" -> 0.6769. Matched specifically as
// "the number right before *", not just the first number in the string —
// that would instead grab the leading 50 from 50vh/50vw.
function firstCoefficient(calc: string): number {
  const match = calc.match(/([\d.]+)\s*\*/)
  if (!match) throw new Error(`no multiplier coefficient found in: ${calc}`)
  return Number(match[1])
}

describe('CONSOLE_ASPECT', () => {
  it('is the source PNG\'s width/height ratio', () => {
    expect(CONSOLE_ASPECT).toBeCloseTo(812 / 1046, 10)
  })
})

describe('CONSOLE_BOTTOM_INSET', () => {
  it('embeds SIZE verbatim and subtracts from 50vh (the viewport centre line)', () => {
    expect(CONSOLE_BOTTOM_INSET).toContain(SIZE)
    expect(CONSOLE_BOTTOM_INSET.startsWith('calc(50vh - ')).toBe(true)
  })

  it('its coefficient is the fraction of the console below the screen centre', () => {
    // SCREEN_CENTRE_Y% of the console's height sits above the viewport's
    // centre line, so the remaining (100 - SCREEN_CENTRE_Y)% is what has to
    // be subtracted to find where the console's bottom edge lands.
    const expected = (100 - SCREEN_CENTRE_Y) / 100
    expect(firstCoefficient(CONSOLE_BOTTOM_INSET)).toBeCloseTo(expected, 4)
  })
})

describe('CONSOLE_LEFT_FROM_RIGHT / CONSOLE_RIGHT_FROM_LEFT', () => {
  it('both embed SIZE and add to 50vw', () => {
    for (const calc of [CONSOLE_LEFT_FROM_RIGHT, CONSOLE_RIGHT_FROM_LEFT]) {
      expect(calc).toContain(SIZE)
      expect(calc.startsWith('calc(50vw + ')).toBe(true)
    }
  })

  it('their coefficients sum to the full console aspect ratio (they split it left/right of centre)', () => {
    const halfLeft = firstCoefficient(CONSOLE_LEFT_FROM_RIGHT)
    const halfRight = firstCoefficient(CONSOLE_RIGHT_FROM_LEFT)
    expect(halfLeft + halfRight).toBeCloseTo(CONSOLE_ASPECT, 3)
  })

  it('are not equal, since the screen centre is not exactly the console midline', () => {
    expect(CONSOLE_LEFT_FROM_RIGHT).not.toBe(CONSOLE_RIGHT_FROM_LEFT)
  })

  it('the left-from-right coefficient matches SCREEN_CENTRE_X\'s share of the aspect ratio', () => {
    const expected = (SCREEN_CENTRE_X / 100) * CONSOLE_ASPECT
    expect(firstCoefficient(CONSOLE_LEFT_FROM_RIGHT)).toBeCloseTo(expected, 4)
  })
})

describe('LEFT_COLUMN / RIGHT_COLUMN', () => {
  it('both subtract the console edge and the side gap from 50vw', () => {
    for (const calc of [LEFT_COLUMN, RIGHT_COLUMN]) {
      expect(calc).toContain('var(--ns-side-gap)')
      expect(calc).toContain(SIZE)
      expect(calc.startsWith('calc(50vw - ')).toBe(true)
    }
  })
})

describe('SIDE_TEXT_VISIBLE', () => {
  it('gates on both a minimum width and a minimum aspect ratio', () => {
    expect(SIDE_TEXT_VISIBLE).toContain('min-width:1024px')
    expect(SIDE_TEXT_VISIBLE).toContain('min-aspect-ratio:4/3')
  })
})

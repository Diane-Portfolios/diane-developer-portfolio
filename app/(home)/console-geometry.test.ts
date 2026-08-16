import { describe, expect, it } from 'vitest'
import {
  CONSOLE_ASPECT,
  CONSOLE_BOTTOM_INSET,
  SCREEN_CENTRE_Y,
  SCREEN_Y_OFFSET,
  SIZE,
} from './console-geometry'

// Pulls the multiplier coefficient out of a calc() string, e.g.
// "calc(50vh - 0.6769 * min(73vh, ...))" -> 0.6769. Matched specifically as
// "the number right before *", not just the first number in the string —
// that would instead grab the leading 50 from 50vh.
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

describe('SIZE', () => {
  it('caps both height and width via CSS variables (set per-breakpoint in globals.css)', () => {
    expect(SIZE).toBe('min(var(--console-max-h, 73vh), var(--console-max-w, 122vw))')
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

describe('SCREEN_Y_OFFSET', () => {
  it('is the distance from the image\'s own vertical midpoint down to the screen', () => {
    // The screen sits SCREEN_CENTRE_Y% down from the top, above the image's
    // own 50% mark — nudging the box down by (50 - SCREEN_CENTRE_Y)% moves
    // the screen (not the box) to wherever the box was originally centred.
    expect(Number(SCREEN_Y_OFFSET)).toBeCloseTo(50 - SCREEN_CENTRE_Y, 4)
  })

  it('is positive — the screen sits above centre, so the box must move down', () => {
    expect(Number(SCREEN_Y_OFFSET)).toBeGreaterThan(0)
  })
})

import { describe, expect, it } from 'vitest'
import {
  CZECH_SLOTS,
  FADE_MS,
  LANG_ORDER,
  NON_CZECH_NAME,
  ROTATION_CSS,
  SEQUENCE,
  SLOT_COUNT,
  SLOT_MS,
  TOTAL_MS,
  cursorName,
  cursorStyle,
  rotationName,
  rotationStyle,
  slotsFor,
} from './rotation'

describe('SEQUENCE', () => {
  it('has 9 groups of [lang, lang, en] — 27 slots total', () => {
    expect(SLOT_COUNT).toBe(SEQUENCE.length)
    expect(SLOT_COUNT).toBe(LANG_ORDER.length * 3)
  })

  it('places "en" as every third entry', () => {
    for (let i = 2; i < SEQUENCE.length; i += 3) {
      expect(SEQUENCE[i]).toBe('en')
    }
  })

  it('gives every language in LANG_ORDER exactly two turns', () => {
    for (const lang of LANG_ORDER) {
      expect(slotsFor(lang)).toHaveLength(2)
    }
  })

  it('gives English a turn in every group (9 turns)', () => {
    expect(slotsFor('en')).toHaveLength(LANG_ORDER.length)
  })

  it('derives TOTAL_MS from SLOT_COUNT * SLOT_MS', () => {
    expect(TOTAL_MS).toBe(SLOT_COUNT * SLOT_MS)
  })
})

describe('CZECH_SLOTS', () => {
  it('matches slotsFor("cs")', () => {
    expect(CZECH_SLOTS).toEqual(slotsFor('cs'))
    expect(CZECH_SLOTS).toHaveLength(2)
  })
})

describe('rotationName / cursorName', () => {
  it('strips hyphens from multi-part language codes', () => {
    expect(rotationName('zh-Hans')).toBe('ns-rot-zhHans')
    expect(cursorName('zh-Hans')).toBe('ns-cur-zhHans')
  })

  it('leaves single-part codes as-is', () => {
    expect(rotationName('fr')).toBe('ns-rot-fr')
    expect(cursorName('fr')).toBe('ns-cur-fr')
  })

  it('NON_CZECH_NAME is a fixed, distinct name', () => {
    expect(NON_CZECH_NAME).toBe('ns-rot-places')
  })
})

describe('rotationStyle / cursorStyle', () => {
  it('rotationStyle points at that language\'s rotation keyframes for the full loop duration', () => {
    expect(rotationStyle('fr')).toEqual({
      animationName: 'ns-rot-fr',
      animationDuration: `${TOTAL_MS}ms`,
    })
  })

  it('cursorStyle points at that language\'s cursor keyframes for the full loop duration', () => {
    expect(cursorStyle('fr')).toEqual({
      animationName: 'ns-cur-fr',
      animationDuration: `${TOTAL_MS}ms`,
    })
  })
})

describe('ROTATION_CSS', () => {
  it('emits one @keyframes rule per unique sequence code, per LANG_ORDER cursor, plus one for NON_CZECH_NAME', () => {
    const uniqueSequenceCodes = new Set(SEQUENCE)
    const expectedRuleCount = uniqueSequenceCodes.size + LANG_ORDER.length + 1
    const actualRuleCount = (ROTATION_CSS.match(/@keyframes/g) ?? []).length
    expect(actualRuleCount).toBe(expectedRuleCount)
  })

  it('includes a rotation rule for every language and for English', () => {
    for (const lang of LANG_ORDER) {
      expect(ROTATION_CSS).toContain(`@keyframes ${rotationName(lang)}`)
    }
    expect(ROTATION_CSS).toContain(`@keyframes ${rotationName('en')}`)
  })

  it('includes a cursor rule for every language but not for English (no menu row)', () => {
    for (const lang of LANG_ORDER) {
      expect(ROTATION_CSS).toContain(`@keyframes ${cursorName(lang)}`)
    }
    expect(ROTATION_CSS).not.toContain(`@keyframes ${cursorName('en')}`)
  })

  it('includes the places (non-Czech) rule', () => {
    expect(ROTATION_CSS).toContain(`@keyframes ${NON_CZECH_NAME}`)
  })

  it('every keyframe percentage is within 0-100 and every rule starts and ends on the same opacity (loops cleanly)', () => {
    const rules = ROTATION_CSS.split('@keyframes ').slice(1)
    for (const rule of rules) {
      const points = [...rule.matchAll(/([\d.]+)%\{opacity:(\d)\}/g)]
      expect(points.length).toBeGreaterThan(0)
      for (const [, pct] of points) {
        expect(Number(pct)).toBeGreaterThanOrEqual(0)
        expect(Number(pct)).toBeLessThanOrEqual(100)
      }
      // First and last keypoint must agree, or the loop would visibly jump
      // from the end of one cycle to the start of the next.
      expect(points[0][2]).toBe(points[points.length - 1][2])
    }
  })
})

describe('timing constants', () => {
  it('FADE_MS is shorter than a single slot, so a fade cannot bleed into the next slot', () => {
    expect(FADE_MS).toBeLessThan(SLOT_MS)
  })
})

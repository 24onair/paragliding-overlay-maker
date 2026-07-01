import { describe, it, expect } from 'vitest'
import { computePosition } from './anchors'

const W = 1920
const H = 1080
const M = 48

describe('computePosition', () => {
  it('top-left = margin, margin', () => {
    expect(computePosition('top-left', 100, 40, W, H, M, 0, 0)).toEqual({
      x: 48,
      y: 48,
    })
  })

  it('top-right hugs the right edge accounting for width', () => {
    expect(computePosition('top-right', 100, 40, W, H, M, 0, 0)).toEqual({
      x: 1920 - 48 - 100,
      y: 48,
    })
  })

  it('bottom-center is horizontally centered, offset from bottom', () => {
    expect(computePosition('bottom-center', 200, 60, W, H, M, 0, 0)).toEqual({
      x: (1920 - 200) / 2,
      y: 1080 - 48 - 60,
    })
  })

  it('applies offsets last', () => {
    expect(computePosition('top-left', 100, 40, W, H, M, 10, -5)).toEqual({
      x: 58,
      y: 43,
    })
  })
})

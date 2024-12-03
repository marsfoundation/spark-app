import { expect } from 'earl'
import { chunkRange } from './chunkRange'

describe(chunkRange.name, () => {
  it('chunks from 0 to 10', () => {
    expect(chunkRange(0, 10, 3)).toEqual([
      [0, 2], // 0, 1, 2
      [3, 5], // 3, 4, 5
      [6, 8], // 6, 7, 8,
      [9, 10], // 9, 10
    ])
  })

  it('chunks into one big chunk', () => {
    expect(chunkRange(0, 9, 10)).toEqual([[0, 9]])
  })

  it('chunks into two chunks', () => {
    expect(chunkRange(0, 10, 10)).toEqual([
      [0, 9],
      [10, 10],
    ])
  })

  it('chunks not from 0', () => {
    expect(chunkRange(5, 10, 10)).toEqual([[5, 10]])
  })

  it('chunks edge cases', () => {
    expect(chunkRange(5, 5, 10)).toEqual([[5, 5]])
    expect(chunkRange(5, 5, 1)).toEqual([[5, 5]])
  })
})

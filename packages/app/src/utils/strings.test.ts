import { describe, expect, it } from 'vitest'

import { trimCharEnd } from './strings'

describe(trimCharEnd.name, () => {
  it('removes the specified character from the end of the string', () => {
    const result = trimCharEnd('helloooo', 'o')
    expect(result).toBe('hell')
  })

  it('does nothing if the character does not exist at the end', () => {
    const result = trimCharEnd('hello', 'l')
    expect(result).toBe('hello')
  })

  it('removes all instances of the character if they are consecutive at the end', () => {
    const result = trimCharEnd('bananaaa', 'a')
    expect(result).toBe('banan')
  })

  it('handles empty string cases correctly', () => {
    const result = trimCharEnd('', 'a')
    expect(result).toBe('')
  })
})

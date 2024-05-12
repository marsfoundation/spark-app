import { describe } from 'bun:test'

import { preprocessSearchParams } from './preprocessSearchParams'

describe(preprocessSearchParams.name, () => {
  test('unwinds object without array into a array of keys and values', () => {
    const input = {
      a: '1',
      b: '2',
      c: '3',
    }

    expect(preprocessSearchParams(input)).toEqual([
      ['a', '1'],
      ['b', '2'],
      ['c', '3'],
    ])
  })

  test('unwinds object with an array into a array with entry for each array item', () => {
    const input = {
      a: ['1', '2', '3'],
      b: 'B',
    }

    expect(preprocessSearchParams(input)).toEqual([
      ['a', '1'],
      ['a', '2'],
      ['a', '3'],
      ['b', 'B'],
    ])
  })

  test('returns empty object', () => {
    const input = {}

    expect(preprocessSearchParams(input)).toEqual([])
  })
})

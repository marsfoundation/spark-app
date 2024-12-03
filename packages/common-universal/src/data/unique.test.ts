import { expect } from 'earl'
import { unique } from './unique'

describe(unique.name, () => {
  it('removes duplicates', () => {
    const input = [1, 1, 2, 3, 4, 5, 3, 10]
    const output = unique(input)

    expect(output).toEqual([1, 2, 3, 4, 5, 10])
  })

  it('removes duplicates with custom serializer and deserializer', () => {
    const input = [{ id: 1 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 3 }, { id: 10 }]
    const output = unique(input, {
      serializer: JSON.stringify,
      deserializer: JSON.parse,
    })

    expect(output).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 10 }])
  })
})

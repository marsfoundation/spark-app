import { assert } from '../assert/assert.js'

export function reverseDictionary<K extends string | number, T extends string | number>(
  dictionary: Record<K, T>,
): Record<T, K> {
  const reversedDictionary: Record<T, K> = {} as Record<T, K>
  const seenValues = new Set<T>()

  for (const [key, value] of Object.entries(dictionary)) {
    assert(!seenValues.has(value as T), `Duplicate value found: ${value}`)
    seenValues.add(value as T)
    reversedDictionary[value as T] = key as K
  }

  return reversedDictionary
}

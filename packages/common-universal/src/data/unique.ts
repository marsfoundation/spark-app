import { assert } from '../assert'

/**
 * Remove duplicates from an array of objects.
 */
export function unique<V>(input: V[], opts?: { serializer?: (v: V) => string; deserializer?: (s: string) => V }): V[] {
  if (opts) {
    assert(opts.serializer && opts.deserializer, 'Expected serializer and deserializer to be defined')
  }

  function id(v: V): V {
    return v
  }

  const set = new Set(input.map(opts?.serializer ?? (id as any)))
  return Array.from(set).map(opts?.deserializer ?? (id as any))
}

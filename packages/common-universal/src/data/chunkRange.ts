/**
 * Both `from` and `to` are inclusive.
 */
export function chunkRange(from: number, to: number, chunkSize: number): [number, number][] {
  const ranges = [] as [number, number][]

  let left = from
  while (left + chunkSize <= to) {
    ranges.push([left, left + chunkSize - 1])
    left += chunkSize
  }
  ranges.push([left, to])

  return ranges
}

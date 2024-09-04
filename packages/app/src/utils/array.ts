export function range(start: number, end: number, step = 1): number[] {
  const output = []

  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

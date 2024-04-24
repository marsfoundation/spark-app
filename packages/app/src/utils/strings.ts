import invariant from 'tiny-invariant'

export function trimCharEnd(str: string, char: string): string {
  invariant(char.length === 1, 'char has to be a single character')
  let endIndex = str.length - 1

  while (endIndex >= 0 && str[endIndex] === char) {
    endIndex--
  }

  return str.slice(0, endIndex + 1)
}

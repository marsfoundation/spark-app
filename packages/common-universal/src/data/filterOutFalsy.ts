export function filterOutFalsy<T>(array: (T | undefined | false | null)[]): T[] {
  return array.filter((value): value is T => value !== undefined && value !== false && value !== null)
}

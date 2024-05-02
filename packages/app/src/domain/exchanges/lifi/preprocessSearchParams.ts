/**
 * Unwind arrays inside of dictionaries to a flat list of (repeated) key-value pairs supported by URLSearchParams
 */
export function preprocessSearchParams(params: Record<string, string | string[]>): [string, string][] {
  return Object.entries(params).flatMap(([key, value]): [string, string][] => {
    if (Array.isArray(value)) {
      return value.map((v) => [key, v])
    }
    return [[key, value] as const]
  })
}

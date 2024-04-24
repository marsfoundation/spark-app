/**
 * Like JSON.stringify, but supports BigInt
 */
export function JSONStringifyRich(obj: any): string {
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }

    return value
  })
}

export function filterOutUndefinedKeys<T extends Object>(obj: T): T {
  if (Array.isArray(obj)) {
    const res = obj
      .map((v) => {
        if (v !== null && typeof v === 'object') {
          return filterOutUndefinedKeys(v)
        }

        return v
      })
      .filter((v) => v !== undefined)

    return res as any
  }

  const result: any = {}

  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object' && v.constructor === Object) {
      result[k] = filterOutUndefinedKeys(v)
    } else {
      if (v !== undefined) {
        result[k] = v
      }
    }
  }

  return result
}

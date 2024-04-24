export function makeFunctionsComparisonStable<T extends Object>(obj: T): T {
  return mapValuesRecursive(obj, (_key, value) => {
    if (value instanceof Function) {
      return value.toString()
    }
    return value
  })
}

export function mapValuesRecursive<T extends Object>(obj: T, mapper: (key: string, value: any) => any): T {
  const result: any = {}

  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object') {
      result[k] = mapValuesRecursive(v, mapper)
    } else {
      result[k] = mapper(k, v)
    }
  }

  return result
}

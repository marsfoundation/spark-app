/* eslint-disable */
export function toJSON(parameters: object): string {
  return JSON.stringify(parameters, (_k, v: unknown) => {
    if (typeof v === 'bigint') {
      return v.toString()
    }

    // uses a generic check to catch any promise-like objects (e.g. Promise, Bluebird, etc.)
    const isPromise =
      typeof v === 'object' &&
      v !== null &&
      typeof (v as any).then === 'function' &&
      typeof (v as any).catch === 'function'
    if (isPromise) {
      return 'Promise'
    }

    return v
  })
}

export function formatDate(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  return `${padStart(date.getDate())}-${padStart(date.getMonth() + 1)}-${date.getFullYear()}`
}

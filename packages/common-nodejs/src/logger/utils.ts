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

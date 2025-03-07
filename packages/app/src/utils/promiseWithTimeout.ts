export function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let rejectTimeoutId: ReturnType<typeof setTimeout>

  const rejectTimeoutPromise = new Promise<never>((_, reject) => {
    rejectTimeoutId = setTimeout(() => {
      reject(new PromiseTimeoutError(timeoutMs))
    }, timeoutMs)
  })

  return Promise.race([
    promise.finally(() => {
      clearTimeout(rejectTimeoutId)
    }),
    rejectTimeoutPromise,
  ])
}

export class PromiseTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Query timed out after ${timeoutMs}ms`)
    this.name = 'PromiseTimeoutError'
  }
}

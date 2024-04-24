export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class NotRetryableError extends Error {
  constructor(public readonly underlyingError: Error) {
    super(underlyingError.message)
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  { retries = 5, delay = 200 }: { retries?: number; delay?: number } = {},
): Promise<T> {
  let lastError = null

  while (retries-- >= 0) {
    try {
      return await fn()
    } catch (e) {
      if (e instanceof NotRetryableError) {
        throw e.underlyingError
      }
      lastError = e
      await sleep(delay)
    }
  }

  throw lastError
}

import { sleep } from '@marsfoundation/common-universal'

export interface RetryOptions {
  maxCalls: number
  delay: number | ((attempt: number) => number)
  isRetryableError: (error: unknown) => boolean
  isRetryableStatus: (status: number) => boolean
}

export async function fetchRetry(options: RetryOptions) {
  return (url: string | URL | RequestInfo, requestInit: RequestInit = {}) =>
    fetchWithRetries(url, requestInit, options, 0)
}

async function fetchWithRetries(
  url: string | URL | RequestInfo,
  requestInit: RequestInit,
  options: RetryOptions,
  currentAttempt = 0,
): Promise<Response> {
  try {
    const result = await fetch(url, requestInit)
    if (options.isRetryableStatus(result.status) && currentAttempt + 1 < options.maxCalls) {
      return retry(url, requestInit, options, currentAttempt)
    }
    return result
  } catch (e) {
    if (!options.isRetryableError(e) || currentAttempt + 1 >= options.maxCalls) {
      throw e
    }
    return retry(url, requestInit, options, currentAttempt)
  }
}

async function retry(
  url: string | URL | RequestInfo,
  requestInit: RequestInit,
  options: RetryOptions,
  currentRetry: number,
): Promise<Response> {
  const delay = typeof options.delay === 'function' ? options.delay(currentRetry) : options.delay
  await sleep(delay)
  return fetchWithRetries(url, requestInit, options, currentRetry + 1)
}

export const defaultRetryOptions: RetryOptions = {
  maxCalls: 6,
  delay: (attempt) => 2 ** attempt * 150,
  isRetryableError: (_) => true,
  isRetryableStatus: (status) => status >= 500,
}

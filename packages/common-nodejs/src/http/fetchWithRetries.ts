import { sleep } from '@marsfoundation/common-universal'

export interface RetryOptions {
  maxCalls: number
  delay: number | ((attempt: number) => number)
  isRetryableStatus: (status: number) => boolean
}

type FetchType = typeof fetch

export function fetchRetry(options: RetryOptions): FetchType {
  return (url: string | URL | RequestInfo, requestInit: RequestInit = {}) =>
    fetchWithRetries(url, requestInit, options, 0)
}

async function fetchWithRetries(
  url: string | URL | RequestInfo,
  requestInit: RequestInit,
  options: RetryOptions,
  currentAttempt: number,
): ReturnType<FetchType> {
  try {
    const result = await fetch(url, requestInit)
    if (options.isRetryableStatus(result.status) && currentAttempt < options.maxCalls - 1) {
      return retry(url, requestInit, options, currentAttempt)
    }
    return result
  } catch (e) {
    if (currentAttempt >= options.maxCalls - 1) {
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
  isRetryableStatus: (status) => status >= 500,
}

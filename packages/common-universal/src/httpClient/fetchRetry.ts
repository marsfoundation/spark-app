import { sleep } from '../async/async.js'

export interface RetryOptions {
  fetch: FetchType
  maxCalls: number
  delay: number | ((attempt: number) => number)
  isRetryableStatus: (status: number) => boolean
}

type FetchType = typeof fetch

export function fetchRetry(options: RetryOptions): FetchType {
  return (url, requestInit = {}) => fetchWithRetries(url, requestInit, options, 0)
}

async function fetchWithRetries(
  url: string | URL | RequestInfo,
  requestInit: RequestInit,
  options: RetryOptions,
  currentAttempt: number,
): ReturnType<FetchType> {
  try {
    const result = await options.fetch(url, requestInit)
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
  currentAttempt: number,
): ReturnType<FetchType> {
  await sleep(getRetryDelay(options, currentAttempt))
  return fetchWithRetries(url, requestInit, options, currentAttempt + 1)
}

export function getRetryDelay(options: RetryOptions, currentAttempt: number): number {
  return typeof options.delay === 'function' ? options.delay(currentAttempt) : options.delay
}

export const defaultRetryOptions: RetryOptions = {
  // passing fetch directly would lose binding to window in browser
  fetch: (...args) => fetch(...args),
  maxCalls: 5,
  delay: (attempt) => 2 ** attempt * 150,
  isRetryableStatus: (status) => status >= 500,
}

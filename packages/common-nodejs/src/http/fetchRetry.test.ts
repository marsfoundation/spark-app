import * as FakeTimers from '@sinonjs/fake-timers'
import { MockFunctionOf, expect, mockFn } from 'earl'
import { mergeDeep } from 'remeda'
import { spy } from 'tinyspy'
import { RetryOptions, fetchRetry, getRetryDelay } from './fetchRetry.js'

const testUrl = 'test'
const testError = new Error('Fetch error')

describe(fetchRetry.name, () => {
  let clock: FakeTimers.InstalledClock
  beforeEach(() => {
    clock = FakeTimers.install()
  })
  afterEach(() => clock.uninstall())

  it('returns immediately on success', async () => {
    const retryOptions = getTestRetryOptions({ status: 200 })
    const fetch = fetchRetry(retryOptions)

    const result = await fetch(testUrl)
    expect(result.status).toEqual(200)
    expect(retryOptions.fetch).toHaveBeenCalledTimes(1)
  })

  it('retires in case of error', async () => {
    const retryOptions = getTestRetryOptions({ status: 200 })
    retryOptions.fetch.throwsOnce(testError)
    const fetch = fetchRetry(retryOptions)

    const promisedResponse = fetch(testUrl)
    await clock.runAllAsync()

    expect((await promisedResponse).status).toEqual(200)
    expect(retryOptions.fetch).toHaveBeenCalledTimes(2)
  })

  it('throws error after maxCalls', async () => {
    const retryOptions = getTestRetryOptions({ status: 200 })
    retryOptions.fetch.throws(testError)
    const fetch = fetchRetry(retryOptions)

    const promisedResponse = fetch(testUrl)
    await clock.runAllAsync()

    await expect(promisedResponse).toBeRejectedWith(testError.message)
    expect(retryOptions.fetch).toHaveBeenCalledTimes(retryOptions.maxCalls)
  })

  it('retries if real fetch throws', async () => {
    const spiedFetch = spy(fetch)
    const retryOptions = getTestRetryOptions({ fetch: spiedFetch, status: 200 })
    const fetchWithRetries = fetchRetry(retryOptions)

    const promisedResponse = fetchWithRetries('invalidUrl')
    await clock.runAllAsync()

    await expect(promisedResponse).toBeRejectedWith('Failed to parse URL from invalidUrl')
    expect(spiedFetch.callCount).toEqual(retryOptions.maxCalls)
  })

  it('retries maxCalls times when status is retryable', async () => {
    const retryOptions = getTestRetryOptions({
      status: 500,
      isRetryableStatus: (_) => true,
    })
    const fetch = fetchRetry(retryOptions)

    const promisedResponse = fetch(testUrl)
    await clock.runAllAsync()

    expect((await promisedResponse).status).toEqual(500)
    expect(retryOptions.fetch).toHaveBeenCalledTimes(retryOptions.maxCalls)
  })

  it('waits before retries when status is retryable', async () => {
    const retryOptions = getTestRetryOptions({ status: 500, isRetryableStatus: (_) => true, delay: 1 })
    const fetch = fetchRetry(retryOptions)
    const promisedResponse = fetch(testUrl)

    expect(retryOptions.fetch).toHaveBeenCalledTimes(1)

    await clock.tickAsync(getRetryDelay(retryOptions, 0))
    expect(retryOptions.fetch).toHaveBeenCalledTimes(2)

    await clock.tickAsync(getRetryDelay(retryOptions, 1))
    expect(retryOptions.fetch).toHaveBeenCalledTimes(3)

    expect((await promisedResponse).status).toEqual(500)
  })

  it('waits before retries when throws', async () => {
    const retryOptions = getTestRetryOptions({ status: 200, delay: 1 })
    retryOptions.fetch.throws(testError)
    const fetch = fetchRetry(retryOptions)
    const promisedResponse = fetch(testUrl)

    expect(retryOptions.fetch).toHaveBeenCalledTimes(1)

    await clock.tickAsync(getRetryDelay(retryOptions, 0))
    expect(retryOptions.fetch).toHaveBeenCalledTimes(2)

    await clock.tickAsync(getRetryDelay(retryOptions, 1))
    expect(retryOptions.fetch).toHaveBeenCalledTimes(3)

    await expect(promisedResponse).toBeRejectedWith(testError.message)
  })
})

type FetchMock = MockFunctionOf<RetryOptions['fetch']>
interface TestRetryOptionsInput extends Partial<RetryOptions> {
  fetch?: FetchMock | RetryOptions['fetch']
  status: number
}
type TestRetryOptions = RetryOptions & { fetch: FetchMock }

function getTestRetryOptions(options: TestRetryOptionsInput): TestRetryOptions {
  const defaultOptions: TestRetryOptions = {
    fetch: getFetchMock(options.status),
    delay: 0,
    isRetryableStatus: (_status: number) => false,
    maxCalls: 3,
  }
  return mergeDeep(defaultOptions, options) as TestRetryOptions
}

function getFetchMock(status: number): FetchMock {
  return mockFn<RetryOptions['fetch']>(async (_input, _init) => ({ status }) as Response)
}

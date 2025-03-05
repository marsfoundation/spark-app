import * as FakeTimers from '@sinonjs/fake-timers'
import { MockFunctionOf, expect, mockFn } from 'earl'
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
interface TestRetryOptions extends Partial<Omit<RetryOptions, 'fetch'>> {
  status: number
}

function getTestRetryOptions(options: TestRetryOptions): RetryOptions & { fetch: FetchMock } {
  return {
    fetch: getFetchMock(options.status),
    delay: options?.delay ?? 0,
    isRetryableStatus: options?.isRetryableStatus ?? ((_status) => false),
    maxCalls: options?.maxCalls ?? 3,
  }
}

function getFetchMock(status: number): FetchMock {
  return mockFn<RetryOptions['fetch']>(
    async (_input, _init) =>
      ({
        status,
        ok: status >= 200 && status < 300,
      }) as Response,
  )
}

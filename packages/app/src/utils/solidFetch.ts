import fetchRetry from 'fetch-retry'

export const solidFetch = fetchRetry(fetch, {
  retries: 5,
  retryOn(_attempt, error, response) {
    const retry = error !== null || !response?.ok
    if (retry) {
      // eslint-disable-next-line no-console
      console.log('Retrying failed fetch', { error, status: response?.status })
    }

    return retry
  },
  retryDelay(attempt) {
    return Math.pow(2, attempt) * 150
  },
})

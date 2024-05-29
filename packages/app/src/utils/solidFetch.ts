import fetchRetry from 'fetch-retry'

export const solidFetch = fetchRetry(fetch, {
  retries: 5,
  retryOn(_attempt, error, response) {
    const retry = error !== null || !response?.ok
    if (retry) {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Retrying failed fetch', { error, status: response?.status })
    }

    return retry
  },
  retryDelay(attempt) {
    return 2 ** attempt * 150
  },
})

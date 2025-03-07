import fetchRetry from 'fetch-retry'

// @todo redo as HttpClient class

export const solidFetch = fetchRetry(fetch, {
  async retryOn(attempt, error, response) {
    if (attempt > 4) {
      return false
    }

    const retry = error !== null || !response?.ok
    if (retry) {
      const errorMsg = await response?.text()
      // biome-ignore lint/suspicious/noConsoleLog: debugging
      console.log('[solidFetch] Retrying error', { error, response, errorMsg, attempt })
    }

    return retry
  },
  retryDelay(attempt) {
    return 2 ** attempt * 150
  },
})

export type SolidFetch = typeof solidFetch

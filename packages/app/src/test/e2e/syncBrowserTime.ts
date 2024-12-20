export async function syncBrowserTime({ rpcUrl }: { rpcUrl: string }): Promise<void> {
  interface FetchRetryOptions {
    retries?: number
    baseDelay?: number // delay in ms between retries
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function fetchWithRetry(
    input: RequestInfo | URL,
    init?: RequestInit,
    options?: FetchRetryOptions,
  ): Promise<Response> {
    const { retries = 3, baseDelay = 150 } = options || {}

    let attempt = 0
    let lastError: any

    while (attempt < retries) {
      try {
        const response = await fetch(input, init)
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
        }
        return response
      } catch (error) {
        lastError = error
        attempt++
        if (attempt < retries) {
          // Exponential backoff: delay = baseDelay * 2^(attempt-1)
          const waitTime = baseDelay * 2 ** (attempt - 1)
          await sleep(waitTime)
        }
      }
    }

    throw lastError
  }

  const response = await fetchWithRetry(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
    }),
  })
  const { result } = (await response.json()) as { result: any }
  const date = new Date(Number(result.timestamp) * 1000)

  const fakeNow = date.valueOf()

  // biome-ignore lint/suspicious/noGlobalAssign: <explanation>
  // @ts-ignore
  Date = class extends Date {
    // @ts-ignore
    constructor(...args) {
      if (args.length === 0) {
        super(fakeNow)
      } else {
        // @ts-ignore
        super(...args)
      }
    }
  }

  Date.now = () => fakeNow
}

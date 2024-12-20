export async function syncBrowserTime({ rpcUrl }: { rpcUrl: string }): Promise<void> {
  const response = await fetch(rpcUrl, {
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

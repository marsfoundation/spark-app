import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { useSexyDaiRedeemAll } from './useSexyDaiRedeemAll'

const account = testAddresses.alice

const hookRenderer = setupHookRenderer({
  hook: useSexyDaiRedeemAll,
  account,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId: gnosis.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {},
})

describe(useSexyDaiRedeemAll.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems all xDAI', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemAllXDAI',
          args: [account],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()

    result.current.write()

    await waitFor(() => {
      expect(result.current.status.kind).toBe('success')
    })
  })
})

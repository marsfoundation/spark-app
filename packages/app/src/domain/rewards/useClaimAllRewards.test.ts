import { incentiveControllerAbi } from '@/config/abis/incentiveControllerAbi'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport/handlers'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { useClaimAllRewards } from './useClaimAllRewards'

const account = testAddresses.alice
const incentiveControllerAddress = testAddresses.token
const assets = [testAddresses.token2]

const initialArgs = {
  assets,
  incentiveControllerAddress,
}

const hookRenderer = setupHookRenderer({
  hook: useClaimAllRewards,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: initialArgs,
})

describe(useClaimAllRewards.name, () => {
  test('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled for empty assets list ', async () => {
    const { result } = hookRenderer({ args: { ...initialArgs, assets: [] } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { ...initialArgs, enabled: false } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('claims rewards', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: incentiveControllerAddress,
          from: account,
          abi: incentiveControllerAbi,
          functionName: 'claimAllRewards',
          args: [assets, account],
          result: [assets, [1n]],
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

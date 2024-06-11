import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { UseWithdrawAndSwap } from './useWithdrawAndSwap'

const gem = getMockToken({ address: testAddresses.token, decimals: 6 })
const assetsToken = getMockToken({ address: testAddresses.token2, decimals: 18 })
const account = testAddresses.alice
const gemAmountOut = BaseUnitNumber(10)
const psmActions = testAddresses.token3

const hookRenderer = setupHookRenderer({
  hook: UseWithdrawAndSwap,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { gem, assetsToken, gemAmountOut, psmActions },
})

describe(UseWithdrawAndSwap.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { gemAmountOut: BaseUnitNumber(0), psmActions, gem, assetsToken } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, gemAmountOut, psmActions, gem, assetsToken } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('withdraws using psm actions', async () => {
    const { result } = hookRenderer({
      args: { gemAmountOut, psmActions, gem, assetsToken },
      extraHandlers: [
        handlers.contractCall({
          to: psmActions,
          abi: psmActionsAbi,
          functionName: 'withdrawAndSwap',
          args: [account, toBigInt(gemAmountOut), toBigInt(gemAmountOut.multipliedBy(1e12))],
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

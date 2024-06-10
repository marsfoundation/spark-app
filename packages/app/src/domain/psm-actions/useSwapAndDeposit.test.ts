import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { useSwapAndDeposit } from './useSwapAndDeposit'

const gem = testAddresses.token
const account = testAddresses.alice
const gemAmount = BaseUnitNumber(1)
const psmActions = testAddresses.token2

const hookRenderer = setupHookRenderer({
  hook: useSwapAndDeposit,
  account,
  handlers: [
    handlers.chainIdCall({ chainId: mainnet.id }),
    handlers.balanceCall({ balance: 0n, address: account }),
    handlers.contractCall({
      to: psmActions,
      abi: psmActionsAbi,
      functionName: 'gem',
      result: gem,
    }),
  ],
  args: {
    gemAmount,
    psmActions,
  },
})

describe(useSwapAndDeposit.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 gem value', async () => {
    const { result } = hookRenderer({ args: { gemAmount: BaseUnitNumber(0), psmActions } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, gemAmount, psmActions } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits using psm actions', async () => {
    const { result } = hookRenderer({
      args: {
        gemAmount,
        psmActions,
      },
      extraHandlers: [
        handlers.contractCall({
          to: psmActions,
          abi: psmActionsAbi,
          functionName: 'swapAndDeposit',
          args: [account, toBigInt(gemAmount), toBigInt(gemAmount)],
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

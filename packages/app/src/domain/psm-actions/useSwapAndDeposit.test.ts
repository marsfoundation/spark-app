import { psmActionsAbi, psmActionsAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { useSwapAndDeposit } from './useSwapAndDeposit'

const gem = getMockToken({ address: testAddresses.token, decimals: 6 })
const assetsToken = getMockToken({ address: testAddresses.token2, decimals: 18 })
const account = testAddresses.alice
const gemAmount = BaseUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: useSwapAndDeposit,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { gem, assetsToken, gemAmount },
})

describe(useSwapAndDeposit.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 gem value', async () => {
    const { result } = hookRenderer({ args: { gemAmount: BaseUnitNumber(0), gem, assetsToken } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, gemAmount, gem, assetsToken } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits using psm actions', async () => {
    const { result } = hookRenderer({
      args: { gem, gemAmount, assetsToken },
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'swapAndDeposit',
          args: [account, toBigInt(gemAmount), toBigInt(gemAmount.multipliedBy(1e12))],
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

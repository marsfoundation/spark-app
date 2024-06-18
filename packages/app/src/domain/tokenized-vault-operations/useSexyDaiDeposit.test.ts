import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { useSexyDaiDeposit } from './useSexyDaiDeposit'

const account = testAddresses.alice
const value = BaseUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: useSexyDaiDeposit,
  account,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId: gnosis.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    value,
  },
})

describe(useSexyDaiDeposit.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { value: BaseUnitNumber(0) } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, value } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits xDAI', async () => {
    const { result } = hookRenderer({
      args: {
        value,
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'depositXDAI',
          args: [account],
          value: toBigInt(value),
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

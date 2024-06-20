import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { BaseUnitNumber } from '../types/NumericValues'
import { useSexyDaiRedeem } from './useSexyDaiRedeem'

const account = testAddresses.alice
const sharesAmount = BaseUnitNumber(10)
const sDai = testAddresses.token

const hookRenderer = setupHookRenderer({
  hook: useSexyDaiRedeem,
  account,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId: gnosis.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { sDai, sharesAmount },
})

describe(useSexyDaiRedeem.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { sharesAmount: BaseUnitNumber(0), sDai } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, sDai, sharesAmount } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems xDAI', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemXDAI',
          args: [toBigInt(sharesAmount), account],
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

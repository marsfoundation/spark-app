import { savingsDaiAbi, savingsDaiAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { useVaultWithdraw } from './useVaultWithdraw'

const account = testAddresses.alice
const value = BaseUnitNumber(10)

const hookRenderer = setupHookRenderer({
  hook: useVaultWithdraw,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { value },
})

describe(useVaultWithdraw.name, () => {
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

  it('withdraws from vault', async () => {
    const { result } = hookRenderer({
      args: {
        value,
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsDaiAddress[mainnet.id],
          abi: savingsDaiAbi,
          functionName: 'withdraw',
          args: [toBigInt(value), account, account],
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

  it('withdraws max from vault', async () => {
    const { result } = hookRenderer({
      args: {
        value,
        max: true,
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsDaiAddress[mainnet.id],
          abi: savingsDaiAbi,
          functionName: 'redeem',
          args: [toBigInt(value), account, account],
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

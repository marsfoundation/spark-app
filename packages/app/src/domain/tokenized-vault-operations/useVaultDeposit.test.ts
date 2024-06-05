import { savingsDaiAbi, savingsDaiAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { useVaultDeposit } from './useVaultDeposit'

const token = testAddresses.token
const account = testAddresses.alice
const assets = BaseUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: useVaultDeposit,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    token,
    assets,
  },
})

describe(useVaultDeposit.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 assets value', async () => {
    const { result } = hookRenderer({ args: { assets: BaseUnitNumber(0), token } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, assets, token } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits into vault', async () => {
    const { result } = hookRenderer({
      args: {
        token,
        assets,
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsDaiAddress[mainnet.id],
          abi: savingsDaiAbi,
          functionName: 'deposit',
          args: [toBigInt(assets), account],
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

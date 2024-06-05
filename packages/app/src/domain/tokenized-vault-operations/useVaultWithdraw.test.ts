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
const assets = BaseUnitNumber(10)
const shares = BaseUnitNumber(11)
const baseHandlers = [
  handlers.chainIdCall({ chainId: mainnet.id }),
  handlers.balanceCall({ balance: 0n, address: account }),
]

const withdrawHookRenderer = setupHookRenderer({
  hook: useVaultWithdraw,
  account,
  handlers: baseHandlers,
  args: { assets },
})

const withdrawMaxHookRenderer = setupHookRenderer({
  hook: useVaultWithdraw,
  account,
  handlers: baseHandlers,
  args: { max: true, shares },
})

describe(useVaultWithdraw.name, () => {
  describe('withdraw', () => {
    it('is not enabled for guest ', async () => {
      const { result } = withdrawHookRenderer({ account: undefined })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('is not enabled for 0 assets value', async () => {
      const { result } = withdrawHookRenderer({ args: { assets: BaseUnitNumber(0) } })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('is not enabled when explicitly disabled', async () => {
      const { result } = withdrawHookRenderer({ args: { enabled: false, assets } })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('withdraws from vault', async () => {
      const { result } = withdrawHookRenderer({
        args: {
          assets,
        },
        extraHandlers: [
          handlers.contractCall({
            to: savingsDaiAddress[mainnet.id],
            abi: savingsDaiAbi,
            functionName: 'withdraw',
            args: [toBigInt(assets), account, account],
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

  describe('withdraw max', () => {
    it('is not enabled for guest ', async () => {
      const { result } = withdrawMaxHookRenderer({ account: undefined })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('is not enabled for 0 shares value', async () => {
      const { result } = withdrawMaxHookRenderer({ args: { shares: BaseUnitNumber(0), max: true } })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('is not enabled when explicitly disabled', async () => {
      const { result } = withdrawMaxHookRenderer({ args: { enabled: false, shares, max: true } })

      await waitFor(() => {
        expect(result.current.status.kind).toBe('disabled')
      })
    })

    it('withdraws max from vault', async () => {
      const { result } = withdrawMaxHookRenderer({
        args: {
          max: true,
          shares,
        },
        extraHandlers: [
          handlers.contractCall({
            to: savingsDaiAddress[mainnet.id],
            abi: savingsDaiAbi,
            functionName: 'redeem',
            args: [toBigInt(shares), account, account],
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
})

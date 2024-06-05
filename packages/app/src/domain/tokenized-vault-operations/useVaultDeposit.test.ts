import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { erc4626Abi } from 'viem'
import { useVaultDeposit } from './useVaultDeposit'

const assetToken = testAddresses.token
const account = testAddresses.alice
const assetsAmount = BaseUnitNumber(1)
const vault = {
  address: testAddresses.token,
  abi: erc4626Abi,
}

const hookRenderer = setupHookRenderer({
  hook: useVaultDeposit,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    assetToken,
    assetsAmount,
    vault,
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
    const { result } = hookRenderer({ args: { assetsAmount: BaseUnitNumber(0), assetToken, vault } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, assetsAmount, assetToken, vault } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits into vault', async () => {
    const { result } = hookRenderer({
      args: {
        assetToken,
        assetsAmount,
        vault,
      },
      extraHandlers: [
        handlers.contractCall({
          to: vault.address,
          abi: vault.abi,
          functionName: 'deposit',
          args: [toBigInt(assetsAmount), account],
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

import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayAbi, wethGatewayAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'

import { useWithdraw } from './useWithdraw'

const asset = testAddresses.token
const account = testAddresses.alice
const value = BaseUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: useWithdraw,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    value,
    asset,
  },
})

describe(useWithdraw.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { asset, value: BaseUnitNumber(0) } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { asset, value, enabled: false } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('withdraws native asset', async () => {
    const { result } = hookRenderer({
      args: {
        asset: NATIVE_ASSET_MOCK_ADDRESS,
        value,
      },
      extraHandlers: [
        handlers.contractCall({
          to: wethGatewayAddress[mainnet.id],
          abi: wethGatewayAbi,
          functionName: 'withdrawETH',
          args: [lendingPoolAddress[mainnet.id], toBigInt(value), account],
          from: account,
          result: undefined,
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

  it('withdraws non native asset', async () => {
    const { result } = hookRenderer({
      args: {
        asset,
        value,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'withdraw',
          args: [asset, toBigInt(value), account],
          result: toBigInt(value),
          from: account,
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

  it('uses proper config if other asset', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'withdraw',
          args: [asset, toBigInt(value), account],
          result: toBigInt(value),
          from: account,
        }),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()
  })
})

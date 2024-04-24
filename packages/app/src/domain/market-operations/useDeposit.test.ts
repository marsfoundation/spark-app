import { waitFor } from '@testing-library/react'
import { generatePrivateKey } from 'viem/accounts'
import { mainnet } from 'viem/chains'

import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayAbi, wethGatewayAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'

import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'
import { useDeposit } from './useDeposit'

const asset = testAddresses.token
const account = testAddresses.alice
const value = BaseUnitNumber(1)
const referralCode = 0

const hookRenderer = setupHookRenderer({
  hook: useDeposit,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    value,
    asset,
  },
})

describe(useDeposit.name, () => {
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

  it('deposits native asset', async () => {
    const { result } = hookRenderer({
      args: { asset: NATIVE_ASSET_MOCK_ADDRESS, value },
      extraHandlers: [
        handlers.contractCall({
          to: wethGatewayAddress[mainnet.id],
          abi: wethGatewayAbi,
          functionName: 'depositETH',
          args: [lendingPoolAddress[mainnet.id], account, referralCode],
          from: account,
          result: undefined,
          value: toBigInt(value),
        }),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()
  })

  it('deposits any token', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'deposit',
          args: [asset, toBigInt(value), account, referralCode],
          from: account,
          result: undefined,
        }),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()
  })

  it('deposits with permit', async () => {
    const random32Bytes = generatePrivateKey()
    const permitDeadline = new Date()

    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'supplyWithPermit',
          args: [
            asset,
            toBigInt(value),
            account,
            referralCode,
            toBigInt(getTimestampInSeconds(permitDeadline)),
            0,
            random32Bytes,
            random32Bytes,
          ],
          from: account,
          result: undefined,
        }),
      ],
      args: {
        value,
        asset,
        permit: {
          token: new Token({
            address: asset,
            decimals: 18,
            symbol: TokenSymbol('TEST'),
            name: 'Test',
            unitPriceUsd: '1',
          }),
          deadline: permitDeadline,
          signature: {
            r: random32Bytes,
            s: random32Bytes,
            v: 0n,
          },
        },
      },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()
  })
})

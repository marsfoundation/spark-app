import { waitFor } from '@testing-library/react'
import { generatePrivateKey } from 'viem/accounts'
import { mainnet } from 'viem/chains'

import { poolAbi } from '@/config/abis/poolAbi'
import { InterestRate, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayAbi, wethGatewayAddress } from '@/config/contracts-generated'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'

import { BaseUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'
import { useRepay } from './useRepay'

const asset = testAddresses.token
const account = testAddresses.alice
const value = BaseUnitNumber(1)
const interestRateMode = BigInt(InterestRate.Variable)

const initialArgs = {
  value,
  asset,
  useAToken: false,
}

const hookRenderer = setupHookRenderer({
  hook: useRepay,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: initialArgs,
})

describe(useRepay.name, () => {
  test('is not enabled for guest', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { ...initialArgs, value: BaseUnitNumber(0) } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { ...initialArgs, enabled: false } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('repays with aToken', async () => {
    const { result } = hookRenderer({
      args: {
        ...initialArgs,
        useAToken: true,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'repayWithATokens',
          args: [asset, toBigInt(value), interestRateMode],
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

  test('repays with a native token', async () => {
    const { result } = hookRenderer({
      args: {
        ...initialArgs,
        asset: NATIVE_ASSET_MOCK_ADDRESS,
      },
      extraHandlers: [
        handlers.contractCall({
          to: wethGatewayAddress[mainnet.id],
          abi: wethGatewayAbi,
          functionName: 'repayETH',
          args: [lendingPoolAddress[mainnet.id], toBigInt(value), interestRateMode, account],
          from: account,
          result: undefined,
          value: toBigInt(value),
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

  test('repays with a not aToken', async () => {
    const { result } = hookRenderer({
      args: {
        ...initialArgs,
        useAToken: false,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'repay',
          args: [asset, toBigInt(value), interestRateMode, account],
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

  test('repays with permit', async () => {
    const random32Bytes = generatePrivateKey()
    const permitDeadline = new Date()

    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'repayWithPermit',
          args: [
            asset,
            toBigInt(value),
            interestRateMode,
            account,
            toBigInt(getTimestampInSeconds(permitDeadline)),
            0,
            random32Bytes,
            random32Bytes,
          ],
          from: account,
          result: 1n,
        }),
      ],
      args: {
        value,
        asset,
        useAToken: false,
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

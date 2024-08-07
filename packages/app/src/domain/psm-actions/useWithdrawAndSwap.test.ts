import { psmActionsAbi, psmActionsAddress } from '@/config/contracts-generated'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { daiLikeReserve, getMockToken, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, expect, test } from 'vitest'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { marketBalancesQueryKey } from '../wallet/marketBalances'
import { useWithdrawAndSwap } from './useWithdrawAndSwap'

const gem = getMockToken({ address: testAddresses.token, decimals: 6 })
const assetsToken = getMockToken({ address: testAddresses.token2, decimals: 18 })
const owner = testAddresses.alice
const receiver = testAddresses.bob
const gemAmountOut = BaseUnitNumber(10)
const mode = 'withdraw'
const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

const hookRenderer = setupHookRenderer({
  hook: useWithdrawAndSwap,
  account: owner,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: owner })],
  args: { gem, assetsToken, gemAmountOut, mode },
})

describe(useWithdrawAndSwap.name, () => {
  test('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({
      args: { gemAmountOut: BaseUnitNumber(0), gem, assetsToken, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({
      args: { enabled: false, gemAmountOut, gem, assetsToken, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('withdraws using psm actions', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'withdrawAndSwap',
          args: [owner, toBigInt(gemAmountOut), toBigInt(gemAmountOut.multipliedBy(1e12))],
          from: owner,
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

  test('withdraws using psm actions with custom receiver', async () => {
    const { result } = hookRenderer({
      args: {
        gemAmountOut,
        gem,
        assetsToken,
        receiver,
        reserveAddresses,
        mode: 'send',
      },
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'withdrawAndSwap',
          args: [receiver, toBigInt(gemAmountOut), toBigInt(gemAmountOut.multipliedBy(1e12))],
          from: owner,
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

  test('invalidates allowance and balances queries', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'withdrawAndSwap',
          args: [owner, toBigInt(gemAmountOut), toBigInt(gemAmountOut.multipliedBy(1e12))],
          from: owner,
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

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({
        token: assetsToken.address,
        spender: psmActionsAddress[mainnet.id],
        account: owner,
        chainId: mainnet.id,
      }),
    )

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      marketBalancesQueryKey({ account: owner, chainId: mainnet.id }),
    )
  })
})

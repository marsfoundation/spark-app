import { psmActionsAbi, psmActionsAddress } from '@/config/contracts-generated'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { daiLikeReserve, getMockToken, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { erc4626Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { useRedeemAndSwap } from './useRedeemAndSwap'

const gem = getMockToken({ address: testAddresses.token, decimals: 6 })
const assetsToken = getMockToken({ address: testAddresses.token2, decimals: 18 })
const owner = testAddresses.alice
const receiver = testAddresses.bob
const sharesAmount = BaseUnitNumber(1)
const savingsToken = testAddresses.token3
const assetsAmount = BaseUnitNumber(1e18)
const mode = 'withdraw'
const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

const hookRenderer = setupHookRenderer({
  hook: useRedeemAndSwap,
  account: owner,
  handlers: [
    handlers.chainIdCall({ chainId: mainnet.id }),
    handlers.balanceCall({ balance: 0n, address: owner }),
    handlers.contractCall({
      to: psmActionsAddress[mainnet.id],
      abi: psmActionsAbi,
      functionName: 'savingsToken',
      result: savingsToken,
    }),
    handlers.contractCall({
      to: savingsToken,
      abi: erc4626Abi,
      functionName: 'convertToAssets',
      args: [toBigInt(sharesAmount)],
      result: toBigInt(assetsAmount),
    }),
  ],
  args: { gem, assetsToken, sharesAmount, mode },
})

describe(useRedeemAndSwap.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 gem value', async () => {
    const { result } = hookRenderer({
      args: { sharesAmount: BaseUnitNumber(0), gem, assetsToken, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({
      args: { enabled: false, sharesAmount, gem, assetsToken, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems using psm actions', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'redeemAndSwap',
          args: [owner, toBigInt(sharesAmount), toBigInt(assetsAmount.dividedBy(1e12))],
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

  it('redeems using psm actions with custom receiver', async () => {
    const { result, invalidationManager } = hookRenderer({
      args: {
        gem,
        assetsToken,
        sharesAmount,
        receiver,
        reserveAddresses,
        mode: 'send',
      },
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'redeemAndSwap',
          args: [receiver, toBigInt(sharesAmount), toBigInt(assetsAmount.dividedBy(1e12))],
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

    await waitFor(() => {
      expect(
        invalidationManager.hasBeenInvalidated(
          allowanceQueryKey({
            token: assetsToken.address,
            spender: psmActionsAddress[mainnet.id],
            account: owner,
            chainId: mainnet.id,
          }),
        ),
      ).toBe(true)
    })
  })
})

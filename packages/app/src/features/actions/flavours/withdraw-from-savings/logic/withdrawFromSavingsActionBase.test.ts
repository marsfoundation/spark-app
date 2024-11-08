import { basePsm3Abi, basePsm3Address } from '@/config/abis/basePsm3Abi'
import { LAST_UI_REFERRAL_CODE_BIGINT } from '@/config/consts'
import { PotSavingsInfo } from '@/domain/savings-info/potSavingsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { bigNumberify, toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { base } from 'viem/chains'
import { describe, test } from 'vitest'
import { createWithdrawFromSavingsActionConfig } from './withdrawFromSavingsAction'

const account = testAddresses.alice
const receiver = testAddresses.bob
const withdrawAmount = NormalizedUnitNumber(1)
const usds = testTokens.USDS
const susds = testTokens.sUSDS
const usdc = testTokens.USDC
const referralCode = LAST_UI_REFERRAL_CODE_BIGINT
const mockTokensInfo = new TokensInfo(
  [
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: susds, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    USDS: usds.symbol,
    sUSDS: susds.symbol,
  },
)
const timestamp = 1000
const mockSavingsUsdsInfo = new PotSavingsInfo({
  potParams: {
    dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
    rho: bigNumberify(timestamp),
    chi: bigNumberify('1000000000000000000000000000'), // 1
  },
  currentTimestamp: timestamp + 24 * 60 * 60,
})
const chainId = base.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'withdrawFromSavings',
      token: usds,
      savingsToken: susds,
      amount: withdrawAmount,
      isRedeem: false,
      mode: 'withdraw',
    },
    enabled: true,
  },
})

describe(createWithdrawFromSavingsActionConfig.name, () => {
  test('withdraws usds from susds', async () => {
    const maxAmountIn = NormalizedUnitNumber(withdrawAmount.dividedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usds,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactOut',
          args: [
            susds.address,
            usds.address,
            toBigInt(usds.toBaseUnit(withdrawAmount)),
            toBigInt(susds.toBaseUnit(maxAmountIn)),
            account,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })

  test('withdraws max usds from susds', async () => {
    const minAmountOut = NormalizedUnitNumber(withdrawAmount.multipliedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usds,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            susds.address,
            usds.address,
            toBigInt(susds.toBaseUnit(withdrawAmount)),
            toBigInt(usds.toBaseUnit(minAmountOut)),
            account,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })

  test('sends usds from susds', async () => {
    const maxAmountIn = NormalizedUnitNumber(withdrawAmount.dividedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usds,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactOut',
          args: [
            susds.address,
            usds.address,
            toBigInt(usds.toBaseUnit(withdrawAmount)),
            toBigInt(susds.toBaseUnit(maxAmountIn)),
            receiver,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })

  test('sends max usds from susds', async () => {
    const minAmountOut = NormalizedUnitNumber(withdrawAmount.multipliedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usds,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            susds.address,
            usds.address,
            toBigInt(susds.toBaseUnit(withdrawAmount)),
            toBigInt(usds.toBaseUnit(minAmountOut)),
            receiver,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })

  test('withdraws usdc from susds', async () => {
    const maxAmountIn = NormalizedUnitNumber(withdrawAmount.dividedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usdc,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactOut',
          args: [
            susds.address,
            usdc.address,
            toBigInt(usdc.toBaseUnit(withdrawAmount)),
            toBigInt(susds.toBaseUnit(maxAmountIn)),
            account,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: susds.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })

  test('withdraws max usdc from susds', async () => {
    const minAmountOut = NormalizedUnitNumber(withdrawAmount.multipliedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usdc,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            susds.address,
            usdc.address,
            toBigInt(susds.toBaseUnit(withdrawAmount)),
            toBigInt(usdc.toBaseUnit(minAmountOut)),
            account,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: susds.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })

  test('sends usdc from susds', async () => {
    const maxAmountIn = NormalizedUnitNumber(withdrawAmount.dividedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usdc,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactOut',
          args: [
            susds.address,
            usdc.address,
            toBigInt(usdc.toBaseUnit(withdrawAmount)),
            toBigInt(susds.toBaseUnit(maxAmountIn)),
            receiver,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: susds.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })

  test('sends max usdc from susds', async () => {
    const minAmountOut = NormalizedUnitNumber(withdrawAmount.multipliedBy(1.1))

    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: usdc,
          savingsToken: susds,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo, savingsUsdsInfo: mockSavingsUsdsInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            susds.address,
            usdc.address,
            toBigInt(susds.toBaseUnit(withdrawAmount)),
            toBigInt(usdc.toBaseUnit(minAmountOut)),
            receiver,
            referralCode,
          ],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: susds.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })
})

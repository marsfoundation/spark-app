import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { describe, test } from 'vitest'
import { createWithdrawFromSavingsActionConfig } from './withdrawFromSavingsAction'

const account = testAddresses.alice
const receiver = testAddresses.bob
const withdrawAmount = NormalizedUnitNumber(1)
const dai = testTokens.DAI
const sdai = testTokens.sDAI
const usds = testTokens.USDS
const susds = testTokens.sUSDS
const usdc = testTokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: susds, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: susds.symbol,
  },
)
const chainId = gnosis.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'withdrawFromSavings',
      token: dai,
      savingsToken: sdai,
      amount: withdrawAmount,
      isRedeem: false,
      mode: 'withdraw',
    },
    enabled: true,
  },
})

describe(createWithdrawFromSavingsActionConfig.name, () => {
  test('withdraws xdai from sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: dai,
          savingsToken: sdai,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[chainId],
          abi: savingsXDaiAdapterAbi,
          functionName: 'withdrawXDAI',
          args: [toBigInt(dai.toBaseUnit(withdrawAmount)), account],
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
      allowanceQueryKey({ token: sdai.address, spender: savingsXDaiAdapterAddress[chainId], account, chainId }),
    )
  })

  test('withdraws max xdai from sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: dai,
          savingsToken: sdai,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'withdraw',
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[chainId],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemXDAI',
          args: [toBigInt(sdai.toBaseUnit(withdrawAmount)), account],
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
      allowanceQueryKey({ token: sdai.address, spender: savingsXDaiAdapterAddress[chainId], account, chainId }),
    )
  })

  test('sends xdai from sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: dai,
          savingsToken: sdai,
          amount: withdrawAmount,
          isRedeem: false,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[chainId],
          abi: savingsXDaiAdapterAbi,
          functionName: 'withdrawXDAI',
          args: [toBigInt(dai.toBaseUnit(withdrawAmount)), receiver],
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
      allowanceQueryKey({ token: sdai.address, spender: savingsXDaiAdapterAddress[chainId], account, chainId }),
    )
  })

  test('sends max xdai from sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'withdrawFromSavings',
          token: dai,
          savingsToken: sdai,
          amount: withdrawAmount,
          isRedeem: true,
          mode: 'send',
          receiver,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[chainId],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemXDAI',
          args: [toBigInt(sdai.toBaseUnit(withdrawAmount)), receiver],
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
      allowanceQueryKey({ token: sdai.address, spender: savingsXDaiAdapterAddress[chainId], account, chainId }),
    )
  })
})

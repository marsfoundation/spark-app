import { basePsm3Abi, basePsm3Address } from '@/config/abis/basePsm3Abi'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { base } from 'viem/chains'
import { describe, test } from 'vitest'
import { createDepositToSavingsActionConfig } from './depositToSavingsAction'

const account = testAddresses.alice
const depositValue = NormalizedUnitNumber(1)
const usds = testTokens.USDS
const susds = testTokens.sUSDS
const usdc = testTokens.USDC
const referralCode = 0n
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

const chainId = base.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'depositToSavings', token: usds, savingsToken: susds, value: depositValue }, enabled: true },
})

describe(createDepositToSavingsActionConfig.name, () => {
  test('deposits usds to susds', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: usds, savingsToken: susds, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.chainIdCall({ chainId }),
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            usds.address,
            susds.address,
            toBigInt(usds.toBaseUnit(depositValue)),
            toBigInt(usds.toBaseUnit(depositValue)),
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
      allowanceQueryKey({ token: usds.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })

  test('deposits usdc to susds', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: usdc, savingsToken: susds, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      chain: base,
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            usdc.address,
            susds.address,
            toBigInt(usdc.toBaseUnit(depositValue)),
            toBigInt(usdc.toBaseUnit(depositValue).multipliedBy(1e12)),
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
      allowanceQueryKey({ token: usdc.address, spender: basePsm3Address[base.id], account, chainId }),
    )
  })
})

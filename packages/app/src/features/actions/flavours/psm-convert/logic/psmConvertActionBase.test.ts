import { basePsm3Abi, basePsm3Address } from '@/config/abis/basePsm3Abi'
import { LAST_UI_REFERRAL_CODE_BIGINT } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { getMockToken, testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { base } from 'viem/chains'
import { describe, test } from 'vitest'
import { allowanceQueryKey } from '../../approve/logic/query'
import { createPsmConvertActionConfig } from './psmConvertAction'

const account = testAddresses.alice
const chainId = base.id
const usdc = getMockToken({ symbol: TokenSymbol('USDC'), decimals: 6 })
const usds = getMockToken({ symbol: TokenSymbol('USDS') })
const amount = NormalizedUnitNumber(1)

const mockTokensInfo = new TokensInfo(
  [
    { token: usdc, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
  ],
  {
    USDS: testTokens.USDS.symbol,
    sUSDS: testTokens.sUSDS.symbol,
  },
)

const hookRenderer = setupUseContractActionRenderer({
  account,
  chain: base,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'psmConvert',
      inToken: usdc,
      outToken: usds,
      amount,
    },
    enabled: true,
    context: { tokensInfo: mockTokensInfo },
  },
})

describe(createPsmConvertActionConfig.name, () => {
  test('converts usdc to usds', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            usdc.address,
            usds.address,
            toBigInt(usdc.toBaseUnit(amount)),
            toBigInt(usds.toBaseUnit(amount)),
            account,
            LAST_UI_REFERRAL_CODE_BIGINT,
          ],
          from: account,
          result: toBigInt(usdc.toBaseUnit(amount)),
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
      allowanceQueryKey({
        token: usdc.address,
        spender: basePsm3Address[base.id],
        account,
        chainId,
      }),
    )
  })

  test('converts usds to usdc', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'psmConvert',
          inToken: usds,
          outToken: usdc,
          amount,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: basePsm3Address[base.id],
          abi: basePsm3Abi,
          functionName: 'swapExactIn',
          args: [
            usds.address,
            usdc.address,
            toBigInt(usds.toBaseUnit(amount)),
            toBigInt(usdc.toBaseUnit(amount)),
            account,
            LAST_UI_REFERRAL_CODE_BIGINT,
          ],
          from: account,
          result: toBigInt(usdc.toBaseUnit(amount)),
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
      allowanceQueryKey({
        token: usds.address,
        spender: basePsm3Address[base.id],
        account,
        chainId,
      }),
    )
  })
})

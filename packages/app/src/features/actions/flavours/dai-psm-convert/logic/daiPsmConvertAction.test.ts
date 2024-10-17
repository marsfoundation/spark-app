import { dssLitePsmConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { getMockToken, testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { allowanceQueryKey } from '../../approve/logic/query'
import { createDaiPsmConvertActionConfig } from './daiPsmConvertAction'

const account = testAddresses.alice
const chainId = mainnet.id
const usdc = getMockToken({ symbol: TokenSymbol('USDC'), decimals: 6 })
const dai = getMockToken({ symbol: TokenSymbol('DAI') })
const amount = NormalizedUnitNumber(1)

const mockTokensInfo = new TokensInfo([{ token: usdc, balance: NormalizedUnitNumber(100) }], {
  DAI: testTokens.DAI.symbol,
  sDAI: testTokens.sDAI.symbol,
  USDS: dai.symbol,
  sUSDS: testTokens.sUSDS.symbol,
})

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'daiPsmConvert',
      inToken: usdc,
      outToken: dai,
      amount,
    },
    enabled: true,
    context: { tokensInfo: mockTokensInfo },
  },
})

describe(createDaiPsmConvertActionConfig.name, () => {
  test('converts usdc to dai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: getContractAddress(dssLitePsmConfig.address, chainId),
          abi: dssLitePsmConfig.abi,
          functionName: 'sellGem',
          args: [account, toBigInt(usdc.toBaseUnit(amount))],
          from: account,
          result: toBigInt(dai.toBaseUnit(amount)),
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
        spender: getContractAddress(dssLitePsmConfig.address, chainId),
        account,
        chainId,
      }),
    )
  })

  test('converts dai to usdc', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'daiPsmConvert',
          inToken: dai,
          outToken: usdc,
          amount,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: getContractAddress(dssLitePsmConfig.address, chainId),
          abi: dssLitePsmConfig.abi,
          functionName: 'buyGem',
          args: [account, toBigInt(usdc.toBaseUnit(amount))],
          from: account,
          result: toBigInt(dai.toBaseUnit(amount)),
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
        token: dai.address,
        spender: getContractAddress(dssLitePsmConfig.address, chainId),
        account,
        chainId,
      }),
    )
  })
})

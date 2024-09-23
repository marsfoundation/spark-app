import { usdsPsmWrapperConfig } from '@/config/contracts-generated'
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
import { createUsdsPsmConvertActionConfig } from './usdsPsmConvertAction'

const account = testAddresses.alice
const chainId = mainnet.id
const usdc = getMockToken({ symbol: TokenSymbol('USDC') })
const usds = getMockToken({ symbol: TokenSymbol('USDS') })
const amount = NormalizedUnitNumber(1)

const mockTokensInfo = new TokensInfo([{ token: usdc, balance: NormalizedUnitNumber(100) }], {
  DAI: testTokens.DAI.symbol,
  sDAI: testTokens.sDAI.symbol,
  USDS: usds.symbol,
  sUSDS: testTokens.sUSDS.symbol,
})

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'usdsPsmConvert',
      inToken: usdc,
      outToken: usds,
      amount,
    },
    enabled: true,
    context: { tokensInfo: mockTokensInfo },
  },
})

describe(createUsdsPsmConvertActionConfig.name, () => {
  test('converts usdc to usds', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          abi: usdsPsmWrapperConfig.abi,
          functionName: 'sellGem',
          args: [account, toBigInt(usdc.toBaseUnit(amount))],
          from: account,
          result: toBigInt(usds.toBaseUnit(amount)),
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
        spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        account,
        chainId,
      }),
    )
  })

  test('converts usds to usdc', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'usdsPsmConvert',
          inToken: usds,
          outToken: usdc,
          amount,
        },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          abi: usdsPsmWrapperConfig.abi,
          functionName: 'buyGem',
          args: [account, toBigInt(usds.toBaseUnit(amount))],
          from: account,
          result: toBigInt(usds.toBaseUnit(amount)),
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
        spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        account,
        chainId,
      }),
    )
  })
})

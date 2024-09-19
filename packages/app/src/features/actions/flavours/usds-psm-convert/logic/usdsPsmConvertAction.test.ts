import { usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { getMockToken, testAddresses } from '@/test/integration/constants'
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
const usdcAmount = NormalizedUnitNumber(1)

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'usdsPsmConvert',
      outToken: 'usds',
      usdc,
      usds,
      usdcAmount,
    },
    enabled: true,
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
          args: [account, toBigInt(usdc.toBaseUnit(usdcAmount))],
          from: account,
          result: toBigInt(usds.toBaseUnit(usdcAmount)),
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
          outToken: 'usdc',
          usdc,
          usds,
          usdcAmount,
        },
        enabled: true,
      },
      extraHandlers: [
        handlers.contractCall({
          to: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          abi: usdsPsmWrapperConfig.abi,
          functionName: 'buyGem',
          args: [account, toBigInt(usdc.toBaseUnit(usdcAmount))],
          from: account,
          result: toBigInt(usds.toBaseUnit(usdcAmount)),
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

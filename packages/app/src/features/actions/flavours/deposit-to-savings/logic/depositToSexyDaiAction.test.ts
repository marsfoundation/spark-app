import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { describe, test } from 'vitest'
import { createDepositToSavingsActionConfig } from './depositToSavingsAction'

const account = testAddresses.alice
const depositValue = NormalizedUnitNumber(1)
const dai = testTokens.DAI
const sdai = testTokens.sDAI
const usds = testTokens.USDS
const snst = testTokens.sUSDS
const usdc = testTokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: snst, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: snst.symbol,
  },
)
const chainId = gnosis.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'depositToSavings', token: dai, savingsToken: sdai, value: depositValue }, enabled: true },
})

describe(createDepositToSavingsActionConfig.name, () => {
  test('deposits xdai to sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: dai, savingsToken: sdai, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[chainId],
          abi: savingsXDaiAdapterAbi,
          functionName: 'depositXDAI',
          args: [account],
          value: toBigInt(toBigInt(dai.toBaseUnit(depositValue))),
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
})

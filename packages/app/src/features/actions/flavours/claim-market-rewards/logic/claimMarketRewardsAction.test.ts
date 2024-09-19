import { incentiveControllerAbi } from '@/config/abis/incentiveControllerAbi'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { createClaimMarketRewardsActionConfig } from './claimMarketRewardsAction'

const account = testAddresses.alice
const chainId = mainnet.id
const incentiveControllerAddress = testAddresses.token
const assets = [testAddresses.token2]
const token = getMockToken()

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'claimMarketRewards', incentiveControllerAddress, assets, token }, enabled: true },
})

describe(createClaimMarketRewardsActionConfig.name, () => {
  test('claims rewards', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: incentiveControllerAddress,
          from: account,
          abi: incentiveControllerAbi,
          functionName: 'claimAllRewards',
          args: [assets, account],
          result: [assets, [1n]],
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

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(aaveDataLayerQueryKey({ chainId, account }))
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ chainId, account }),
    )
  })
})

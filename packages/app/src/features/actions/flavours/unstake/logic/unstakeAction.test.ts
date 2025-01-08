import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { farmAddresses } from '@/config/chain/constants'
import { getFarmsApiDetailsQueryKey } from '@/domain/farms/farmApiDetailsQuery'
import { getFarmsBlockchainDetailsQueryKey } from '@/domain/farms/farmBlockchainDetailsQuery'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { createUnstakeActionConfig } from './unstakeAction'

const account = testAddresses.alice
const chainId = mainnet.id
const stakingToken = getMockToken({ symbol: TokenSymbol('USDS') })
const rewardToken = getMockToken({ symbol: TokenSymbol('SKY') })
const amount = NormalizedUnitNumber(1)

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'unstake',
      farm: farmAddresses[mainnet.id].skyUsds,
      amount,
      exit: false,
      stakingToken,
      rewardToken,
    },
    enabled: true,
  },
})

describe(createUnstakeActionConfig.name, () => {
  test('unstakes from farm', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: farmAddresses[mainnet.id].skyUsds,
          abi: stakingRewardsAbi,
          functionName: 'withdraw',
          args: [toBigInt(stakingToken.toBaseUnit(amount))],
          from: account,
          result: undefined,
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
      getFarmsBlockchainDetailsQueryKey({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(getFarmsApiDetailsQueryKey())
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })

  test('exits from farm', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: {
          type: 'unstake',
          farm: farmAddresses[mainnet.id].skyUsds,
          exit: true,
          amount,
          stakingToken,
          rewardToken,
        },
        enabled: true,
      },
      extraHandlers: [
        handlers.contractCall({
          to: farmAddresses[mainnet.id].skyUsds,
          abi: stakingRewardsAbi,
          functionName: 'exit',
          args: [],
          from: account,
          result: undefined,
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
      getFarmsBlockchainDetailsQueryKey({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(getFarmsApiDetailsQueryKey())
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
  })
})

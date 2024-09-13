import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { STAKING_REWARDS_USDS_ADDRESS } from '@/config/consts'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
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
import { createStakeActionConfig } from './stakeAction'

const account = testAddresses.alice
const chainId = mainnet.id
const stakingToken = getMockToken({ symbol: TokenSymbol('USDS') })
const rewardToken = getMockToken({ symbol: TokenSymbol('SKY') })
const stakeAmount = NormalizedUnitNumber(1)

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: {
      type: 'stake',
      farm: CheckedAddress(STAKING_REWARDS_USDS_ADDRESS),
      stakeAmount,
      stakingToken,
      rewardToken,
    },
    enabled: true,
  },
})

describe(createStakeActionConfig.name, () => {
  test('stakes into farm', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: STAKING_REWARDS_USDS_ADDRESS,
          abi: stakingRewardsAbi,
          functionName: 'stake',
          args: [toBigInt(stakingToken.toBaseUnit(stakeAmount))],
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
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: stakingToken.address, spender: STAKING_REWARDS_USDS_ADDRESS, account, chainId }),
    )
  })
})

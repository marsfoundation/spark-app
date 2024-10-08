import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { getFarmsBlockchainInfoQueryKey } from '@/domain/farms/farmBlockchainInfoQuery copy'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { ClaimFarmRewardsAction } from '../types'

export function createClaimFarmRewardsActionConfig(
  action: ClaimFarmRewardsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      return ensureConfigTypes({
        address: action.farm,
        abi: stakingRewardsAbi,
        functionName: 'getReward',
      })
    },

    invalidates: () => [
      getFarmsBlockchainInfoQueryKey({ chainId, account }),
      getBalancesQueryKeyPrefix({ chainId, account }),
    ],
  }
}

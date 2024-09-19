import { usdsSkyRewardsAbi } from '@/config/contracts-generated'
import { getFarmsInfoQueryKey } from '@/domain/farms/query'
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
        abi: usdsSkyRewardsAbi,
        functionName: 'getReward',
      })
    },

    invalidates: () => [getFarmsInfoQueryKey({ chainId, account }), getBalancesQueryKeyPrefix({ chainId, account })],
  }
}

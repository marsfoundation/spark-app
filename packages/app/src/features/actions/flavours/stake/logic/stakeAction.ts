import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { getFarmsApiDetailsQueryKey } from '@/domain/farms/farmApiDetailsQuery'
import { getFarmsBlockchainDetailsQueryKey } from '@/domain/farms/farmBlockchainDetailsQuery'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { allowanceQueryKey } from '../../approve/logic/query'
import { StakeAction } from '../types'

export function createStakeActionConfig(action: StakeAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      const { stakingToken, farm } = action
      const amount = toBigInt(stakingToken.toBaseUnit(action.stakeAmount))

      return ensureConfigTypes({
        address: farm,
        abi: stakingRewardsAbi,
        functionName: 'stake',
        args: [amount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({ token: action.stakingToken.address, spender: action.farm, account, chainId }),
        getBalancesQueryKeyPrefix({ account, chainId }),
        getFarmsBlockchainDetailsQueryKey({ account, chainId }),
        getFarmsApiDetailsQueryKey(),
      ]
    },
  }
}

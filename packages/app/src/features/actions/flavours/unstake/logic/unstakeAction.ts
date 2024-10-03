import { stakingRewardsAbi } from '@/config/abis/stakingRewardsAbi'
import { getFarmsInfoQueryKey } from '@/domain/farms/query'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { toBigInt } from '@/utils/bigNumber'
import { UnstakeAction } from '../types'

export function createUnstakeActionConfig(action: UnstakeAction, context: ActionContext): ActionConfig {
  const { account, chainId } = context

  return {
    getWriteConfig: () => {
      const { stakingToken, farm } = action
      const amount = toBigInt(stakingToken.toBaseUnit(action.amount))

      if (action.exit) {
        return ensureConfigTypes({
          address: farm,
          abi: stakingRewardsAbi,
          functionName: 'exit',
          args: [],
        })
      }

      return ensureConfigTypes({
        address: farm,
        abi: stakingRewardsAbi,
        functionName: 'withdraw',
        args: [amount],
      })
    },

    invalidates: () => [getFarmsInfoQueryKey({ chainId, account }), getBalancesQueryKeyPrefix({ chainId, account })],
  }
}

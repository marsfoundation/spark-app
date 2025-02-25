import { sparkRewardsConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { activeRewardsQueryKey } from '@/domain/spark-rewards/activeRewardsQueryOptions'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { toBigInt } from '@marsfoundation/common-universal'
import { ActionConfig, ActionContext } from '../../../logic/types'
import { ClaimSparkRewardsAction } from '../types'

export function createClaimSparkRewardsActionConfig(
  action: ClaimSparkRewardsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const sparkRewardsAddress = getContractAddress(sparkRewardsConfig.address, chainId)
  const { epoch, token, cumulativeAmount, merkleRoot, merkleProof } = action

  return {
    getWriteConfig: () => {
      return ensureConfigTypes({
        address: sparkRewardsAddress,
        abi: sparkRewardsConfig.abi,
        functionName: 'claim',
        args: [
          BigInt(epoch),
          account,
          token.address,
          toBigInt(token.toBaseUnit(cumulativeAmount)),
          merkleRoot,
          merkleProof,
        ],
      })
    },

    invalidates: () => [getBalancesQueryKeyPrefix({ chainId, account }), activeRewardsQueryKey({ chainId, account })],
  }
}

import { activeRewardsQueryOptions } from '@/domain/spark-rewards/activeRewardsQueryOptions'
import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

export interface ActiveRewardsParams {
  account?: Address
  chainId: number
}

export type ActiveRewardsResult = SimplifiedQueryResult<ActiveReward[]>

export interface ActiveReward {
  token: Token
  amountToClaim: NormalizedUnitNumber
  cumulativeAmount: NormalizedUnitNumber
  epoch: number
  merkleRoot: Hex
  merkleProof: Hex[]
}

export function useActiveRewards({ account, chainId }: ActiveRewardsParams): ActiveRewardsResult {
  const wagmiConfig = useConfig()

  return useQuery({
    ...activeRewardsQueryOptions({ wagmiConfig, account, chainId }),
    select: (data) =>
      data.map(({ rewardToken, cumulativeAmount, epoch, preClaimed, merkleRoot, merkleProof }) => {
        const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))

        return {
          token: rewardToken,
          amountToClaim,
          cumulativeAmount,
          epoch,
          merkleRoot,
          merkleProof,
        }
      }),
  })
}

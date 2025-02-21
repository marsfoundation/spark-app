import { activeRewardsQueryOptions } from '@/domain/spark-rewards/activeRewardsQueryOptions'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'
import { ActiveRewardsQueryResult } from '../types'

export interface ActiveRewardsParams {
  account?: Address
  chainId: number
}

export function useActiveRewards({ account, chainId }: ActiveRewardsParams): ActiveRewardsQueryResult {
  const wagmiConfig = useConfig()

  return useQuery({
    ...activeRewardsQueryOptions({ wagmiConfig, account, chainId }),
    select: (data) =>
      data.map(({ rewardToken, cumulativeAmount, pendingAmount, preClaimed }) => {
        const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))

        return {
          token: rewardToken,
          amountPending: pendingAmount,
          amountToClaim,
        }
      }),
  })
}

import { Reserve } from '@/domain/market-info/marketInfo'
import { assignSparkRewards } from '@/domain/spark-rewards/assignSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SparkReward } from '../../../domain/spark-rewards/types'

export interface UseSparkRewardsParams {
  chainId: number
  reserve: Reserve
}

export type UseSparkRewardsResult = SparkReward[]

export function useSparkRewards({ chainId, reserve }: UseSparkRewardsParams): UseSparkRewardsResult {
  const wagmiConfig = useConfig()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, chainId }),
    select: (data) => [
      ...assignSparkRewards({ campaigns: data, action: 'supply', reserveTokenSymbol: reserve.token.symbol }),
      ...assignSparkRewards({ campaigns: data, action: 'borrow', reserveTokenSymbol: reserve.token.symbol }),
    ],
  })

  return data ?? []
}

import { transformSimplifiedQueryResult } from '@/domain/common/query'
import { Reserve } from '@/domain/market-info/marketInfo'
import { assignMarketSparkRewards } from '@/domain/spark-rewards/assignMarketSparkRewards'
import { MarketSparkRewards } from '@/domain/spark-rewards/types'
import { useOngoingCampaignsQuery } from '@/domain/spark-rewards/useOngoingCampaignsQuery'

export interface UseSparkRewardsParams {
  chainId: number
  reserve: Reserve
}

export type UseSparkRewardsResult = MarketSparkRewards[]

export function useSparkRewards({ chainId, reserve }: UseSparkRewardsParams): UseSparkRewardsResult {
  const ongoingCampaignsResult = useOngoingCampaignsQuery()

  const { data } = transformSimplifiedQueryResult(ongoingCampaignsResult, (data) => {
    const campaigns = data
      .filter((campaign) => campaign.type === 'sparklend')
      .filter((campaign) => campaign.chainId === chainId)
    return [
      ...assignMarketSparkRewards({ campaigns, action: 'supply', reserveTokenSymbol: reserve.token.symbol }),
      ...assignMarketSparkRewards({ campaigns, action: 'borrow', reserveTokenSymbol: reserve.token.symbol }),
    ]
  })

  return data ?? []
}

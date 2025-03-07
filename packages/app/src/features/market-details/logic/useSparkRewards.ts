import { Reserve } from '@/domain/market-info/marketInfo'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { assignMarketSparkRewards } from '@/domain/spark-rewards/assignMarketSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { MarketSparkRewards } from '@/domain/spark-rewards/types'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

export interface UseSparkRewardsParams {
  chainId: number
  reserve: Reserve
}

export type UseSparkRewardsResult = MarketSparkRewards[]

export function useSparkRewards({ chainId, reserve }: UseSparkRewardsParams): UseSparkRewardsResult {
  const wagmiConfig = useConfig()
  const { isInSandbox, sandboxChainId } = useSandboxState()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, isInSandbox, sandboxChainId }),
    select: (data) => {
      const campaigns = data.filter((campaign) => campaign.chainId === chainId)
      return [
        ...assignMarketSparkRewards({ campaigns, action: 'supply', reserveTokenSymbol: reserve.token.symbol }),
        ...assignMarketSparkRewards({ campaigns, action: 'borrow', reserveTokenSymbol: reserve.token.symbol }),
      ]
    },
  })

  return data ?? []
}

import { Reserve } from '@/domain/market-info/marketInfo'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { assignMarketSparkRewards } from '@/domain/spark-rewards/assignMarketSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { MarketSparkRewards } from '@/domain/spark-rewards/types'
import { filterOngoingCampaigns } from '@/domain/spark-rewards/utils'
import { useVpnCheck } from '@/features/compliance/logic/useVpnCheck'
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
  const { data: vpnCheck, isPending: isVpnCheckPending } = useVpnCheck()

  const { data } = useQuery(ongoingCampaignsQueryOptions({ wagmiConfig, isInSandbox, sandboxChainId }))

  if (isVpnCheckPending || !data) {
    return []
  }

  const campaigns = filterOngoingCampaigns({
    campaigns: data,
    countryCode: vpnCheck?.countryCode,
    chainId,
  })

  return [
    ...assignMarketSparkRewards({ campaigns: campaigns, action: 'supply', reserveTokenSymbol: reserve.token.symbol }),
    ...assignMarketSparkRewards({ campaigns: campaigns, action: 'borrow', reserveTokenSymbol: reserve.token.symbol }),
  ]
}

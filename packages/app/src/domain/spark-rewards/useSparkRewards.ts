import { Reserve } from '@/domain/market-info/marketInfo'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SparkReward } from './types'

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
      ...data
        .filter(
          (campaign) => campaign.type === 'sparklend' && campaign.depositTokenSymbols.includes(reserve.token.symbol),
        )
        .map((campaign) => ({
          rewardTokenSymbol: campaign.rewardTokenSymbol,
          action: 'supply' as const,
          longDescription: campaign.longDescription,
          apy: campaign.type === 'sparklend' ? campaign.apy : undefined,
        })),
      ...data
        .filter(
          (campaign) => campaign.type === 'sparklend' && campaign.borrowTokenSymbols.includes(reserve.token.symbol),
        )
        .map((campaign) => ({
          rewardTokenSymbol: campaign.rewardTokenSymbol,
          action: 'borrow' as const,
          longDescription: campaign.longDescription,
          apy: campaign.type === 'sparklend' ? campaign.apy : undefined,
        })),
    ],
  })

  return data ?? []
}

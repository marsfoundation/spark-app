import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { Token } from '@/domain/types/Token'
import { Percentage } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { AccountSparkRewardsSummary } from '../types'

export interface UseSparkRewardsSummaryParams {
  chainId: number
  savingsToken: Token
}

export function useSparkRewardsSummary({
  chainId,
  savingsToken,
}: UseSparkRewardsSummaryParams): AccountSparkRewardsSummary {
  const wagmiConfig = useConfig()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig }),
    select: (data) => {
      const campaigns = data
        .filter((campaign) => campaign.chainId === chainId)
        .filter((campaign) => campaign.type === 'savings')
        .filter((campaign) => campaign.depositToSavingsTokenSymbols.includes(savingsToken.symbol))

      const totalApy = campaigns.reduce(
        (acc, campaign) => Percentage(acc.plus(campaign.apy ?? 0), { allowMoreThan1: true }),
        Percentage(0),
      )

      const rewards = campaigns.map((campaign) => ({
        rewardTokenSymbol: campaign.rewardTokenSymbol,
        longDescription: campaign.longDescription,
      }))

      return { totalApy, rewards }
    },
  })

  return data ?? { totalApy: Percentage(0), rewards: [] }
}

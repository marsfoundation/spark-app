import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { SimplifiedQueryResult } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { OngoingCampaignRow } from '../types'

export interface UseOngoingCampaignsParams {
  chainId: number
}
export type UseOngoingCampaignsResult = SimplifiedQueryResult<(OngoingCampaignRow & { engage: () => Promise<void> })[]>

export function useOngoingCampaigns({ chainId }: UseOngoingCampaignsParams): UseOngoingCampaignsResult {
  const wagmiConfig = useConfig()

  return useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, chainId }),
    select: (data) =>
      data.map((campaign) => ({
        ...campaign,
        involvedTokensSymbols:
          campaign.type === 'sparklend'
            ? [...campaign.depositTokenSymbols, ...campaign.borrowTokenSymbols]
            : campaign.type === 'savings'
              ? campaign.depositToSavingsTokenSymbols
              : [],
        // @todo: Rewards: implement functionality to get engage function
        engage: () => Promise.resolve(),
      })),
  })
}

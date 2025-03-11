import { SimplifiedQueryResult, transformSimplifiedQueryResult } from '@/domain/common/query'
import { useOngoingCampaignsQuery } from '@/domain/spark-rewards/useOngoingCampaignsQuery'
import { OngoingCampaignRow } from '../types'

export type UseOngoingCampaignsResult = SimplifiedQueryResult<(OngoingCampaignRow & { engage: () => Promise<void> })[]>

export function useOngoingCampaigns(): UseOngoingCampaignsResult {
  const ongoingCampaignsResult = useOngoingCampaignsQuery()

  return transformSimplifiedQueryResult(ongoingCampaignsResult, (data) =>
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
  )
}

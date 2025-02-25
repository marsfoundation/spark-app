import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
}

export function useRewards(): UseRewardsResult {
  const ongoingCampaignsResult = useOngoingCampaigns()

  return {
    ongoingCampaignsResult,
  }
}

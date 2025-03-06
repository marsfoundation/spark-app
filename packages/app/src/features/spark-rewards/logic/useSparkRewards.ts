import { UseClaimableRewardsResult, useClaimableRewards } from './useClaimableRewards'
import { useClaimableRewardsSummary } from './useClaimableRewardsSummary'
import { UseClaimableRewardsSummaryResult } from './useClaimableRewardsSummary'
import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseSparkRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  claimableRewardsResult: UseClaimableRewardsResult
  claimableRewardsSummaryResult: UseClaimableRewardsSummaryResult
}

export function useSparkRewards(): UseSparkRewardsResult {
  const claimableRewardsResult = useClaimableRewards()
  const ongoingCampaignsResult = useOngoingCampaigns()
  const claimableRewardsSummaryResult = useClaimableRewardsSummary()

  return {
    ongoingCampaignsResult,
    claimableRewardsResult,
    claimableRewardsSummaryResult,
  }
}

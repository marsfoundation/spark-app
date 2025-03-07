import { useOpenDialog } from '@/domain/state/dialogs'
import { selectNetworkDialogConfig } from '@/features/dialogs/select-network/SelectNetworkDialog'
import { UseClaimableRewardsResult, useClaimableRewards } from './useClaimableRewards'
import { useClaimableRewardsSummary } from './useClaimableRewardsSummary'
import { UseClaimableRewardsSummaryResult } from './useClaimableRewardsSummary'
import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseSparkRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  claimableRewardsResult: UseClaimableRewardsResult
  claimableRewardsSummaryResult: UseClaimableRewardsSummaryResult
  selectNetwork: () => void
}

export function useSparkRewards(): UseSparkRewardsResult {
  const claimableRewardsResult = useClaimableRewards()
  const ongoingCampaignsResult = useOngoingCampaigns()
  const claimableRewardsSummaryResult = useClaimableRewardsSummary()
  const openDialog = useOpenDialog()

  function selectNetwork(): void {
    openDialog(selectNetworkDialogConfig, {})
  }

  return {
    ongoingCampaignsResult,
    claimableRewardsResult,
    claimableRewardsSummaryResult,
    selectNetwork,
  }
}

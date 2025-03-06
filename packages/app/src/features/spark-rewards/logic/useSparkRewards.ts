import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useAccount } from 'wagmi'
import { ClaimableRewardsResult, useClaimableRewards } from './useClaimableRewards'
import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseSparkRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  claimableRewardsResult: ClaimableRewardsResult
}

export function useSparkRewards(): UseSparkRewardsResult {
  const { chainId } = usePageChainId()
  const { address: account } = useAccount()
  const claimableRewardsResult = useClaimableRewards({ account })
  const ongoingCampaignsResult = useOngoingCampaigns({ chainId })

  return {
    ongoingCampaignsResult,
    claimableRewardsResult,
  }
}

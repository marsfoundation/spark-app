import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useAccount } from 'wagmi'
import { ActiveRewardsResult, useActiveRewards } from './useActiveRewards'
import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseSparkRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  activeRewardsResult: ActiveRewardsResult
}

export function useSparkRewards(): UseSparkRewardsResult {
  const { chainId } = usePageChainId()
  const { address: account } = useAccount()
  const activeRewardsResult = useActiveRewards({ chainId, account })
  const ongoingCampaignsResult = useOngoingCampaigns()

  return {
    ongoingCampaignsResult,
    activeRewardsResult,
  }
}

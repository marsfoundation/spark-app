import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useAccount } from 'wagmi'
import { ActiveRewardsResult, useActiveRewards } from './useActiveRewards'
import { UseOngoingCampaignsResult, useOngoingCampaigns } from './useOngoingCampaigns'

export interface UseRewardsResult {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  activeRewardsResult: ActiveRewardsResult
}

export function useRewards(): UseRewardsResult {
  const { chainId } = usePageChainId()
  const { address: account } = useAccount()
  const activeRewardsResult = useActiveRewards({ chainId, account })
  const ongoingCampaignsResult = useOngoingCampaigns()

  return {
    ongoingCampaignsResult,
    activeRewardsResult,
  }
}

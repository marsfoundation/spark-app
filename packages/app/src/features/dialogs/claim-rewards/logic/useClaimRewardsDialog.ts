import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Objective } from '@/features/actions/logic/types'
import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { useState } from 'react'
import { PageState, PageStatus } from '../../common/types'
import { createClaimMarketRewardsObjectives } from './createClaimMarketRewardsObjectives'
import { getRewardsToClaim } from './getRewardsToClaim'

export interface UseClaimRewardsDialogResult {
  pageStatus: PageStatus
  rewardsToClaim: Reward[]
  objectives: Objective[]
}

export function useClaimRewardsDialog(): UseClaimRewardsDialogResult {
  const { marketInfo } = useMarketInfo()
  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const objectives = createClaimMarketRewardsObjectives(marketInfo)
  const rewardsToClaim = useConditionalFreeze(getRewardsToClaim(marketInfo), pageStatus === 'success')

  return {
    pageStatus: {
      state: pageStatus,
      actionsEnabled: true,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    objectives,
    rewardsToClaim,
  }
}

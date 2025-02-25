import { Token } from '@/domain/types/Token'
import { ClaimSparkRewardsObjective } from '@/features/actions/flavours/claim-spark-rewards/types'
import { Objective } from '@/features/actions/logic/types'
import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { PageState, PageStatus } from '../../common/types'
import { SparkReward } from '../types'
import { useActiveRewards } from './useActiveRewards'
export interface UseClaimSparkRewardsDialogParams {
  tokensToClaim: Token[]
}

export interface UseClaimSparkRewardsDialogResult {
  pageStatus: PageStatus
  rewardsToClaim: SparkReward[]
  objectives: Objective[]
}

export function useClaimSparkRewardsDialog({
  tokensToClaim,
}: UseClaimSparkRewardsDialogParams): UseClaimSparkRewardsDialogResult {
  const chainId = useChainId()
  const { address: account } = useAccount()
  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const { data: activeRewards = [] } = useActiveRewards({ chainId, account })

  const filteredRewards = activeRewards.filter((reward) =>
    tokensToClaim.some((token) => token.address === reward.token.address),
  )
  const objectives: ClaimSparkRewardsObjective[] = filteredRewards.map((reward) => ({
    type: 'claimSparkRewards',
    token: reward.token,
    epoch: reward.epoch,
    cumulativeAmount: reward.cumulativeAmount,
    merkleRoot: reward.merkleRoot,
    merkleProof: reward.merkleProof,
  }))
  const rewardsToClaim = filteredRewards.map((reward) => ({
    token: reward.token,
    amountToClaim: reward.amountToClaim,
  }))
  return {
    pageStatus: {
      state: pageStatus,
      actionsEnabled: true,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    rewardsToClaim,
    objectives,
  }
}

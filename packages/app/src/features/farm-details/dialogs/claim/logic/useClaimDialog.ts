import { Farm } from '@/domain/farms/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { PageState, PageStatus } from '@/features/dialogs/common/types'
import { calculateReward } from '@/features/farm-details/logic/calculateReward'
import { useTimestamp } from '@/utils/useTimestamp'
import { useEffect, useState } from 'react'
import { TxOverview } from '../types'

export interface UseClaimDialogParams {
  farm: Farm
}

export interface UseClaimDialogResult {
  txOverview: TxOverview
  pageStatus: PageStatus
  actionsContext: InjectedActionsContext
  objectives: Objective[]
}

export function useClaimDialog({ farm }: UseClaimDialogParams): UseClaimDialogResult {
  const { timestamp, updateTimestamp } = useTimestamp()
  useEffect(() => {
    updateTimestamp()
  }, [updateTimestamp])

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const rewardAmount = calculateReward({
    earned: farm.blockchainDetails.earned,
    staked: farm.blockchainDetails.staked,
    rewardRate: farm.blockchainDetails.rewardRate,
    earnedTimestamp: farm.blockchainDetails.earnedTimestamp,
    periodFinish: farm.blockchainDetails.periodFinish,
    timestampInMs: timestamp * 1000,
    totalSupply: farm.blockchainDetails.totalSupply,
  })

  return {
    txOverview: {
      reward: {
        token: farm.blockchainDetails.rewardToken,
        tokenPrice: farm.apiDetails.data?.rewardTokenPriceUsd,
        amount: rewardAmount,
      },
    },
    pageStatus: {
      state: pageStatus,
      actionsEnabled: true,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    actionsContext: {},
    objectives: [
      {
        type: 'claimFarmRewards',
        farm: farm.blockchainDetails.address,
        rewardToken: farm.blockchainDetails.rewardToken,
        rewardTokenPrice: farm.apiDetails.data?.rewardTokenPriceUsd,
        rewardAmount,
      },
    ],
  }
}

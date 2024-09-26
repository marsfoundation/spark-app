import { TokenWithValue } from '@/domain/common/types'
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
  reward: TokenWithValue
}

export function useClaimDialog({ farm }: UseClaimDialogParams): UseClaimDialogResult {
  const { timestamp, updateTimestamp } = useTimestamp()
  useEffect(() => {
    updateTimestamp()
  }, [updateTimestamp])

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const rewardAmount = calculateReward({
    earned: farm.earned,
    staked: farm.staked,
    rewardRate: farm.rewardRate,
    earnedTimestamp: farm.earnedTimestamp,
    periodFinish: farm.periodFinish,
    timestampInMs: timestamp * 1000,
    totalSupply: farm.totalSupply,
  })

  return {
    txOverview: {
      reward: {
        token: farm.rewardToken,
        value: rewardAmount,
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
        farm: farm.address,
        rewardToken: farm.rewardToken,
        rewardAmount,
      },
    ],
    reward: {
      token: farm.rewardToken,
      value: rewardAmount,
    },
  }
}

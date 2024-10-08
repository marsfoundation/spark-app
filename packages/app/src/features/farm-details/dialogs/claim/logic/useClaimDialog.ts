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
    earned: farm.blockchainInfo.earned,
    staked: farm.blockchainInfo.staked,
    rewardRate: farm.blockchainInfo.rewardRate,
    earnedTimestamp: farm.blockchainInfo.earnedTimestamp,
    periodFinish: farm.blockchainInfo.periodFinish,
    timestampInMs: timestamp * 1000,
    totalSupply: farm.blockchainInfo.totalSupply,
  })

  return {
    txOverview: {
      reward: {
        token: farm.blockchainInfo.rewardToken,
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
        farm: farm.blockchainInfo.address,
        rewardToken: farm.blockchainInfo.rewardToken,
        rewardAmount,
      },
    ],
    reward: {
      token: farm.blockchainInfo.rewardToken, // @todo: take care of proper formatting when no price available
      value: rewardAmount,
    },
  }
}

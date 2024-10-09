import { Farm } from '@/domain/farms/types'
import { RewardPointsSyncStatus } from '../types'
import { UseRewardPointsDataResult } from './useRewardPointsData'

export function getRewardPointsSyncStatus({
  farm,
  rewardPointsData,
}: { farm: Farm; rewardPointsData: UseRewardPointsDataResult }): RewardPointsSyncStatus | undefined {
  if (farm.blockchainDetails.rewardType !== 'points') {
    return undefined
  }

  if (rewardPointsData.data?.rewardBalance && farm.blockchainDetails.staked.eq(rewardPointsData.data?.balance)) {
    return 'synced'
  }

  if (rewardPointsData.isError) {
    return 'sync-failed'
  }

  return 'out-of-sync'
}

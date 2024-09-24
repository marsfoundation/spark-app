import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { claimRewardsDialogConfig } from '@/features/dialogs/claim-rewards/ClaimRewardsDialog'
import { UseQueryResult } from '@tanstack/react-query'
import { RewardsInfo } from '../types'

export function useRewardsInfo(marketInfo: UseQueryResult<MarketInfo>): RewardsInfo {
  const openDialog = useOpenDialog()

  return {
    rewards: (marketInfo.data?.userRewards ?? []).map((reward) => ({
      token: reward.token,
      amount: reward.value,
    })),
    onClaim: () => {
      openDialog(claimRewardsDialogConfig, {})
    },
  }
}

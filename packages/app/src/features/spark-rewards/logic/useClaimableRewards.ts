import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { claimSparkRewardsDialogConfig } from '@/features/dialogs/claim-spark-rewards/ClaimSparkRewardsDialog'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

export interface ClaimableRewardsParams {
  account?: Address
  chainId: number
}

export type ClaimableRewardsResult = SimplifiedQueryResult<ClaimableReward[]>

export interface ClaimableReward {
  token: Token
  amountPending: NormalizedUnitNumber
  amountToClaim: NormalizedUnitNumber
  openClaimDialog: () => void
}

export function useClaimableRewards({ account, chainId }: ClaimableRewardsParams): ClaimableRewardsResult {
  const wagmiConfig = useConfig()
  const openDialog = useOpenDialog()

  return useQuery({
    ...claimableRewardsQueryOptions({ wagmiConfig, account, chainId }),
    select: (data) =>
      data.map(({ rewardToken, cumulativeAmount, pendingAmount, preClaimed }) => {
        const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))

        return {
          token: rewardToken,
          amountPending: pendingAmount,
          amountToClaim,
          openClaimDialog: () =>
            openDialog(claimSparkRewardsDialogConfig, {
              tokensToClaim: [rewardToken],
            }),
        }
      }),
  })
}

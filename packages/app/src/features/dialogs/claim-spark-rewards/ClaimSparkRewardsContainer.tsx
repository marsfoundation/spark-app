import { Token } from '@/domain/types/Token'
import { useClaimSparkRewardsDialog } from './logic/useClaimSparkRewardsDialog'
import { ClaimSparkRewardsView } from './views/ClaimSparkRewardsView'
import { SuccessView } from './views/SuccessView'

export interface ClaimSparkRewardsDialogContentContainerProps {
  tokensToClaim: Token[]
  closeDialog: () => void
}

export function ClaimSparkRewardsDialogContentContainer({
  tokensToClaim,
  closeDialog,
}: ClaimSparkRewardsDialogContentContainerProps) {
  const { pageStatus, rewardsToClaim, objectives } = useClaimSparkRewardsDialog({ tokensToClaim })

  if (pageStatus.state === 'success') {
    return <SuccessView claimedRewards={rewardsToClaim} onClose={closeDialog} />
  }

  return <ClaimSparkRewardsView pageStatus={pageStatus} objectives={objectives} claims={rewardsToClaim} />
}

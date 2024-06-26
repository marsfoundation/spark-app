import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { useClaimRewardsDialog } from './logic/useClaimRewardsDialog'
import { ClaimRewardsView } from './views/ClaimRewardsView'
import { SuccessView } from './views/SuccessView'

export interface ClaimRewardsDialogContentContainerProps {
  closeDialog: () => void
}

function ClaimRewardsDialogContentContainer({ closeDialog }: ClaimRewardsDialogContentContainerProps) {
  const { pageStatus, rewardsToClaim, objectives } = useClaimRewardsDialog()

  if (pageStatus.state === 'success') {
    return <SuccessView claimedRewards={rewardsToClaim} onClose={closeDialog} />
  }

  return <ClaimRewardsView pageStatus={pageStatus} objectives={objectives} rewards={rewardsToClaim} />
}

const ClaimRewardsDialogContentContainerWithSuspense = withSuspense(
  ClaimRewardsDialogContentContainer,
  DialogContentSkeleton,
)
export { ClaimRewardsDialogContentContainerWithSuspense as ClaimRewardsDialogContentContainer }

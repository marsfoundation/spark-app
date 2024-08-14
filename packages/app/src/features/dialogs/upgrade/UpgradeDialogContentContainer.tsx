import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../common/views/SuccessView'
import { useUpgradeDialog } from './common/logic/useUpgradeDialog'
import { UpgradeDaiToNSTView } from './dai-to-nst/views/UpgradeDaiToNSTView'

interface UpgradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function UpgradeDialogContentContainer({ fromToken, toToken, closeDialog }: UpgradeDialogContentContainerProps) {
  const {
    objectives,
    pageStatus,
    upgradedAmount,
    tokensInfo: { DAI, NST },
    sNstAPY,
  } = useUpgradeDialog({
    fromToken,
    toToken,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        tokenWithValue={{ token: fromToken, value: upgradedAmount }}
        proceedText="Back to Savings"
        objectiveType="upgrade"
        onProceed={closeDialog}
      />
    )
  }

  if (fromToken.symbol === DAI?.symbol && toToken.symbol === NST?.symbol) {
    return (
      <UpgradeDaiToNSTView
        fromToken={fromToken}
        toToken={toToken}
        pageStatus={pageStatus}
        objectives={objectives}
        sNstAPY={sNstAPY}
      />
    )
  }
}

const UpgradeDialogContentContainerWithSuspense = withSuspense(UpgradeDialogContentContainer, DialogContentSkeleton)
export { UpgradeDialogContentContainerWithSuspense as UpgradeDialogContentContainer }

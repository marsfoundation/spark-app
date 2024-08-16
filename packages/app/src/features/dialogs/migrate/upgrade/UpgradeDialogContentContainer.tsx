import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useMigrateDialog } from '../common/logic/useMigrateDialog'
import { UpgradeDaiToNSTView } from './views/UpgradeDaiToNSTView'

interface UpgradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function UpgradeDialogContentContainer({ fromToken, toToken, closeDialog }: UpgradeDialogContentContainerProps) {
  const { objectives, pageStatus, migrationAmount, tokensInfo, apyDifference, actionsContext } = useMigrateDialog({
    type: 'upgrade',
    fromToken,
    toToken,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        tokenWithValue={{ token: fromToken, value: migrationAmount }}
        proceedText="Back to Savings"
        objectiveType="upgrade"
        onProceed={closeDialog}
      />
    )
  }

  if (fromToken.symbol === tokensInfo.DAI?.symbol && toToken.symbol === tokensInfo.NST?.symbol) {
    return (
      <UpgradeDaiToNSTView
        fromToken={fromToken}
        toToken={toToken}
        pageStatus={pageStatus}
        objectives={objectives}
        apyDifference={apyDifference}
        actionsContext={actionsContext}
      />
    )
  }

  raise('Invalid upgrade dialog state')
}

const UpgradeDialogContentContainerWithSuspense = withSuspense(UpgradeDialogContentContainer, DialogContentSkeleton)
export { UpgradeDialogContentContainerWithSuspense as UpgradeDialogContentContainer }

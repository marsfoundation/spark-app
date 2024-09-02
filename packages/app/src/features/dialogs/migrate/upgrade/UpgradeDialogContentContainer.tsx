import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useMigrateDialog } from '../common/logic/useMigrateDialog'
import { UpgradeDaiToUSDSView } from './views/UpgradeDaiToUSDSView'
import { UpgradeSDaiToSUsdsView } from './views/UpgradeSDaiToSUsdsView'

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

  if (fromToken.symbol === tokensInfo.DAI?.symbol && toToken.symbol === tokensInfo.USDS?.symbol) {
    return (
      <UpgradeDaiToUSDSView
        fromToken={fromToken}
        toToken={toToken}
        pageStatus={pageStatus}
        objectives={objectives}
        actionsContext={actionsContext}
      />
    )
  }

  if (fromToken.symbol === tokensInfo.sDAI?.symbol && toToken.symbol === tokensInfo.sUSDS?.symbol) {
    return (
      <UpgradeSDaiToSUsdsView
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

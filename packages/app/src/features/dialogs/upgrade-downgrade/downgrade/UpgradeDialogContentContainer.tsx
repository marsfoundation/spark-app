import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useUpgradeDialog } from '../common/logic/useUpgradeDialog'
import { DowngradeNSTToDaiView } from './nst-to-dai/views/DowngradeNSTToDaiView'

interface UpgradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function UpgradeDialogContentContainer({ fromToken, toToken, closeDialog }: UpgradeDialogContentContainerProps) {
  const { objectives, pageStatus, upgradedAmount, tokensInfo, sNstAPY } = useUpgradeDialog({
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

  if (fromToken.symbol === tokensInfo.DAI?.symbol && toToken.symbol === tokensInfo.NST?.symbol) {
    return (
      <DowngradeNSTToDaiView
        fromToken={fromToken}
        toToken={toToken}
        pageStatus={pageStatus}
        objectives={objectives}
        sNstAPY={sNstAPY}
      />
    )
  }

  raise('Invalid upgrade dialog state')
}

const UpgradeDialogContentContainerWithSuspense = withSuspense(UpgradeDialogContentContainer, DialogContentSkeleton)
export { UpgradeDialogContentContainerWithSuspense as UpgradeDialogContentContainer }

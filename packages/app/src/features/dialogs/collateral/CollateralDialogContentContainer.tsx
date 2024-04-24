import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { DialogContentContainerProps } from '../common/types'
import { useCollateralDialog } from './logic/useCollateralDialog'
import { CollateralView } from './views/CollateralView'
import { SuccessView } from './views/SuccessView'

interface CollateralDialogContentContainerProps extends DialogContentContainerProps {
  useAsCollateral: boolean
}

function CollateralDialogContentContainer({
  useAsCollateral,
  token,
  closeDialog,
}: CollateralDialogContentContainerProps) {
  const { objectives, collateral, validationIssue, currentHealthFactor, updatedHealthFactor, pageStatus } =
    useCollateralDialog({
      useAsCollateral,
      token,
    })
  const collateralSetting = useAsCollateral ? 'enabled' : 'disabled'

  if (pageStatus.state === 'success') {
    return <SuccessView collateralSetting={collateralSetting} token={token} onProceed={closeDialog} />
  }

  return (
    <CollateralView
      pageStatus={pageStatus}
      collateralSetting={collateralSetting}
      collateral={collateral}
      validationIssue={validationIssue}
      objectives={objectives}
      currentHealthFactor={currentHealthFactor}
      updatedHealthFactor={updatedHealthFactor}
    />
  )
}

const CollateralDialogContentContainerWithSuspense = withSuspense(
  CollateralDialogContentContainer,
  DialogContentSkeleton,
)
export { CollateralDialogContentContainerWithSuspense as CollateralDialogContentContainer }

import { EModeCategoryId } from '@/domain/e-mode/types'
import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { useEModeDialog } from './logic/useEModeDialog'
import { EModeView } from './views/EModeView'
import { SuccessView } from './views/SuccessView'

interface EModeDialogContentContainerProps {
  closeDialog: () => void
  userEModeCategoryId: EModeCategoryId
}

function EModeDialogContentContainer({ closeDialog, userEModeCategoryId }: EModeDialogContentContainerProps) {
  const {
    pageStatus,
    selectedEModeCategoryName,
    actions,
    currentPositionOverview,
    updatedPositionOverview,
    eModeCategories,
    validationIssue,
  } = useEModeDialog({ userEModeCategoryId })

  if (pageStatus.state === 'success') {
    return <SuccessView eModeCategoryName={selectedEModeCategoryName} onProceed={closeDialog} />
  }

  return (
    <EModeView
      pageStatus={pageStatus}
      selectedEModeCategoryName={selectedEModeCategoryName}
      objectives={actions}
      currentPositionOverview={currentPositionOverview}
      updatedPositionOverview={updatedPositionOverview}
      eModeCategories={eModeCategories}
      validationIssue={validationIssue}
    />
  )
}

const EModeDialogContentContainerWithSuspense = withSuspense(EModeDialogContentContainer, DialogContentSkeleton)
export { EModeDialogContentContainerWithSuspense as EModeDialogContentContainer }

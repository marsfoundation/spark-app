import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { useConvertStablesDialog } from './logic/useConvertStablesDialog'
import { ConvertStablesView } from './views/ConvertStablesView'
import { SuccessView } from './views/SuccessView'

export interface ConvertStablesDialogContentContainerProps {
  proceedText: string
  closeDialog: () => void
}

function ConvertStablesDialogContentContainer({ proceedText, closeDialog }: ConvertStablesDialogContentContainerProps) {
  const { pageStatus, txOverview, form, formFields, objectives, actionsContext } = useConvertStablesDialog()

  if (pageStatus.state === 'success') {
    return <SuccessView txOverview={txOverview} onProceed={closeDialog} proceedText={proceedText} />
  }

  return (
    <ConvertStablesView
      form={form}
      formFields={formFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      actionsContext={actionsContext}
    />
  )
}

const ConvertStablesDialogContentContainerWithSuspense = withSuspense(
  ConvertStablesDialogContentContainer,
  DialogContentSkeleton,
)
export { ConvertStablesDialogContentContainerWithSuspense as ConvertStablesDialogContentContainer }

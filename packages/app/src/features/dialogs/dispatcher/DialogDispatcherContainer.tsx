import { useChainSensitive } from '@/domain/hooks/useChainSensitive'
import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()

  const isChainMatching = useChainSensitive({
    onChainChange: closeDialog,
  })

  if (!openedDialog || !isChainMatching) {
    return null
  }

  const { element: Dialog, props } = openedDialog

  return <Dialog open setOpen={() => closeDialog()} {...props} />
}

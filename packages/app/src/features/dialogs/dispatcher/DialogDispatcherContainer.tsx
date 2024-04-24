import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'

import { CommonDialogProps } from '../common/types'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()

  if (!openedDialog) {
    return null
  }

  const { element, props } = openedDialog
  const Element = element as React.ComponentType<CommonDialogProps>

  return <Element open setOpen={() => closeDialog()} {...props} />
}

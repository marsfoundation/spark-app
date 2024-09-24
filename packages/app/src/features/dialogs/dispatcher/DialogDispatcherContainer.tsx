import { useChainSensitive } from '@/domain/hooks/useChainSensitive'
import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()
  const closeOnChainChange = openedDialog?.config.options.closeOnChainChange ?? false

  const isChainMatching = useChainSensitive({
    onChainChange: closeOnChainChange ? closeDialog : undefined,
  })

  if (!openedDialog || (!isChainMatching && closeOnChainChange)) {
    return null
  }

  const {
    config: { element: Dialog },
    props,
  } = openedDialog

  return <Dialog open setOpen={closeDialog} {...props} />
}

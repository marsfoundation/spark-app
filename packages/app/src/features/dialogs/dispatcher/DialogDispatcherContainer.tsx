import { useChainSensitive } from '@/domain/hooks/useChainSensitive'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()
  const chainId = useOriginChainId()

  const isChainMatching = useChainSensitive({
    onChainChange: closeDialog,
    chainId,
  })

  if (!openedDialog || isChainMatching) {
    return null
  }

  const { element: Dialog, props } = openedDialog

  return <Dialog open setOpen={() => closeDialog()} {...props} />
}

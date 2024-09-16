import { useChainSensitive } from '@/domain/hooks/useChainSensitive'
import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'
import { useChainId } from 'wagmi'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()
  const chainId = useChainId()

  const isChainMatching = useChainSensitive({
    onChainChange: closeDialog,
    chainId,
  })

  if (!openedDialog || !isChainMatching) {
    return null
  }

  const { element: Dialog, props } = openedDialog

  return <Dialog open setOpen={() => closeDialog()} {...props} />
}

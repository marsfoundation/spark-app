import { UseChainSensitiveParams, useChainSensitive } from '@/domain/hooks/useChainSensitive'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useStore } from '@/domain/state'
import { useCloseDialog } from '@/domain/state/dialogs'
import { PropsWithChildren } from 'react'

export function DialogDispatcherContainer() {
  const openedDialog = useStore((state) => state.dialogs.openedDialog)
  const closeDialog = useCloseDialog()
  const chainId = useOriginChainId()

  if (!openedDialog) {
    return null
  }

  const { element: Element, props, params } = openedDialog

  const dialog = <Element open setOpen={() => closeDialog()} {...props} />

  return params.chainSensitive ? (
    <ChainSensitiveComponent
      chainId={chainId}
      onChainChange={() => {
        closeDialog()
      }}
    >
      {dialog}
    </ChainSensitiveComponent>
  ) : (
    dialog
  )
}

function ChainSensitiveComponent({ children, ...params }: PropsWithChildren<UseChainSensitiveParams>) {
  const isChainMatching = useChainSensitive(params)

  return isChainMatching ? children : null
}

import { useSelectNetworkDialog } from './logic/useSelectNetworkDialog'
import { SelectNetworkDialogView } from './views/SelectNetworkDialogView'

export interface SelectNetworkDialogContentContainerProps {
  closeDialog: () => void
}

export function SelectNetworkDialogContentContainer({ closeDialog }: SelectNetworkDialogContentContainerProps) {
  const { chains } = useSelectNetworkDialog({
    closeDialog,
  })
  return <SelectNetworkDialogView chains={chains} />
}

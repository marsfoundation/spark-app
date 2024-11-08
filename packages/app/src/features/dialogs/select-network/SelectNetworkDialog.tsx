import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps, DialogConfig } from '../common/types'
import { SelectNetworkDialogContentContainer } from './SelectNetworkDialogContentContainer'

export type SelectNetworkDialogProps = CommonDialogProps & {
  asDrawer?: boolean
}

function SelectNetworkDialog({ open, setOpen, asDrawer }: SelectNetworkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent contentVerticalPosition={asDrawer ? 'bottom' : 'center'}>
        <SelectNetworkDialogContentContainer closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const selectNetworkDialogConfig: DialogConfig<SelectNetworkDialogProps> = {
  options: {
    closeOnChainChange: false,
  },
  element: SelectNetworkDialog,
}

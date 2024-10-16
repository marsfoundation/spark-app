import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps, DialogConfig } from '../common/types'
import { SelectNetworkDialogContentContainer } from './SelectNetworkDialogContentContainer'

export type SelectNetworkDialogProps = CommonDialogProps

function SelectNetworkDialog({ open, setOpen }: SelectNetworkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
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

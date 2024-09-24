import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { DialogConfig, DialogProps } from '../common/types'
import { DepositDialogContentContainer } from './DepositDialogContentContainer'

function DepositDialog({ token, open, setOpen }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DepositDialogContentContainer token={token} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const depositDialogConfig: DialogConfig<DialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: DepositDialog,
}

import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../common/types'
import { RepayDialogContentContainer } from './RepayDialogContentContainer'

export interface RepayDialogProps extends CommonDialogProps {
  token: Token
}

function RepayDialog({ token, open, setOpen }: RepayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <RepayDialogContentContainer token={token} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const repayDialogConfig: DialogConfig<RepayDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: RepayDialog,
}

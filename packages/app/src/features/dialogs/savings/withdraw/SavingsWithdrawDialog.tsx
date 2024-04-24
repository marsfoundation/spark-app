import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../../common/types'
import { SavingsWithdrawDialogContentContainer } from './SavingsWithdrawDialogContentContainer'

export function SavingsWithdrawDialog({ open, setOpen }: CommonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsWithdrawDialogContentContainer closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

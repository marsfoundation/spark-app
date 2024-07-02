import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps } from '../../common/types'
import { SavingsWithdrawDialogContentContainer } from './SavingsWithdrawDialogContentContainer'
import { Mode } from './types'

export interface SavingsWithdrawDialogProps extends CommonDialogProps {
  mode: Mode
}

export function SavingsWithdrawDialog({ mode, open, setOpen }: SavingsWithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsWithdrawDialogContentContainer mode={mode} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

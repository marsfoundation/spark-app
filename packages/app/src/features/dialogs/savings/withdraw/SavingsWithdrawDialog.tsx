import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps } from '../../common/types'
import { SavingsWithdrawDialogContentContainer } from './SavingsWithdrawDialogContentContainer'
import { Mode, SavingsType } from './types'

export interface SavingsWithdrawDialogProps extends CommonDialogProps {
  mode: Mode
  savingsType: SavingsType
}

export function SavingsWithdrawDialog({ mode, savingsType, open, setOpen }: SavingsWithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsWithdrawDialogContentContainer
          mode={mode}
          savingsType={savingsType}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

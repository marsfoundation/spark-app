import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../../common/types'
import { SavingsWithdrawDialogContentContainer } from './SavingsWithdrawDialogContentContainer'
import { Mode, SavingsType } from './types'

export type SavingsWithdrawDialogProps = CommonDialogProps & {
  mode: Mode
  savingsType: SavingsType
}

function SavingsWithdrawDialog({ mode, savingsType, open, setOpen }: SavingsWithdrawDialogProps) {
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

export const savingsWithdrawDialogConfig: DialogConfig<SavingsWithdrawDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: SavingsWithdrawDialog,
}

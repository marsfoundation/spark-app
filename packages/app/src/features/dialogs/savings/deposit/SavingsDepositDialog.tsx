import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../../common/types'
import { SavingsDepositDialogContentContainer } from './SavingsDepositDialogContentContainer'

export interface SavingsDepositDialogProps extends CommonDialogProps {
  initialToken: Token
  savingsToken: Token
}

function SavingsDepositDialog({ initialToken, savingsToken, open, setOpen }: SavingsDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsDepositDialogContentContainer
          initialToken={initialToken}
          savingsToken={savingsToken}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export const savingsDepositDialogConfig: DialogConfig<SavingsDepositDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: SavingsDepositDialog,
}

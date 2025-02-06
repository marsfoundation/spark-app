import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../../common/types'
import { SavingsDepositDialogContentContainer } from './SavingsDepositDialogContentContainer'

export interface SavingsDepositDialogProps extends CommonDialogProps {
  initialToken: Token
  savingsToken: Token
  underlyingToken: Token
}

function SavingsDepositDialog({
  initialToken,
  savingsToken,
  underlyingToken,
  open,
  setOpen,
}: SavingsDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsDepositDialogContentContainer
          initialToken={initialToken}
          underlyingToken={underlyingToken}
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

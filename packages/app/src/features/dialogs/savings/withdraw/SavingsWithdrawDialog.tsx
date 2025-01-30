import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../../common/types'
import { SavingsWithdrawDialogContentContainer } from './SavingsWithdrawDialogContentContainer'
import { Mode } from './types'

export type SavingsWithdrawDialogProps = CommonDialogProps & {
  mode: Mode
  savingsToken: Token
  underlyingToken: Token
}

function SavingsWithdrawDialog({ mode, savingsToken, underlyingToken, open, setOpen }: SavingsWithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsWithdrawDialogContentContainer
          mode={mode}
          savingsToken={savingsToken}
          underlyingToken={underlyingToken}
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

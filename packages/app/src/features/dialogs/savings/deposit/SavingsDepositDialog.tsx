import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../../common/types'
import { SavingsDepositDialogContentContainer } from './SavingsDepositDialogContentContainer'

export interface SavingsDepositDialogProps extends CommonDialogProps {
  initialToken: Token
}

export function SavingsDepositDialog({ initialToken, open, setOpen }: SavingsDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsDepositDialogContentContainer initialToken={initialToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

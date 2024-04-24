import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../common/types'
import { WithdrawDialogContentContainer } from './WithdrawDialogContentContainer'

export interface WithdrawDialogProps extends CommonDialogProps {
  token: Token
}

export function WithdrawDialog({ token, open, setOpen }: WithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <WithdrawDialogContentContainer token={token} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

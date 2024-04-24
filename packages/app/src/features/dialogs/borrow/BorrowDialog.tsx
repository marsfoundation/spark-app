import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../common/types'
import { BorrowDialogContentContainer } from './BorrowDialogContentContainer'

export interface BorrowDialogProps extends CommonDialogProps {
  token: Token
}

export function BorrowDialog({ token, open, setOpen }: BorrowDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <BorrowDialogContentContainer token={token} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

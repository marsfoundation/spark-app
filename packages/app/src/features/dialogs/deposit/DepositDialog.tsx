import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { DialogProps } from '../common/types'
import { DepositDialogContentContainer } from './DepositDialogContentContainer'

export function DepositDialog({ token, open, setOpen }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DepositDialogContentContainer token={token} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

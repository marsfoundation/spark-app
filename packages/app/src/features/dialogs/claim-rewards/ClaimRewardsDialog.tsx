import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../common/types'
import { ClaimRewardsDialogContentContainer } from './ClaimRewardsDialogContentContainer'

export function ClaimRewardsDialog({ open, setOpen }: CommonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <ClaimRewardsDialogContentContainer closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

import { Farm } from '@/domain/farms/types'
import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { ClaimDialogContentContainer } from './ClaimDialogContentContainer'

export interface ClaimDialogProps extends CommonDialogProps {
  farm: Farm
}

function ClaimDialog({ farm, open, setOpen }: ClaimDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <ClaimDialogContentContainer farm={farm} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const claimDialogConfig: DialogConfig<ClaimDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: ClaimDialog,
}

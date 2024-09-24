import { EModeCategoryId } from '@/domain/e-mode/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../common/types'
import { EModeDialogContentContainer } from './EModeDialogContentContainer'

interface EModeDialogProps extends CommonDialogProps {
  userEModeCategoryId: EModeCategoryId
}

function EModeDialog({ open, setOpen, userEModeCategoryId }: EModeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <EModeDialogContentContainer userEModeCategoryId={userEModeCategoryId} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const eModeDialogConfig: DialogConfig<EModeDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: EModeDialog,
}

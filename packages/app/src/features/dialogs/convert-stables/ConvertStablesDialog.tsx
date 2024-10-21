import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { ConvertStablesDialogContentContainer } from './ConvertStablesDialogContentContainer'

export interface ConvertStablesDialogProps extends CommonDialogProps {
  proceedText: string
}

function ConvertStablesDialog({ open, setOpen, proceedText }: ConvertStablesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <ConvertStablesDialogContentContainer closeDialog={() => setOpen(false)} proceedText={proceedText} />
      </DialogContent>
    </Dialog>
  )
}

export const convertStablesDialogConfig: DialogConfig<ConvertStablesDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: ConvertStablesDialog,
}

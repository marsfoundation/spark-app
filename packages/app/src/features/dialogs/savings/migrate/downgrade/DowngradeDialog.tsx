import { Token } from '@/domain/types/Token'
import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { DowngradeDialogContentContainer } from './DowngradeDialogContentContainer'

interface DowngradeDialogProps extends CommonDialogProps {
  fromToken: Token
  toToken: Token
}

function DowngradeDialog({ fromToken, toToken, open, setOpen }: DowngradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DowngradeDialogContentContainer fromToken={fromToken} toToken={toToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const downgradeDialogConfig: DialogConfig<DowngradeDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: DowngradeDialog,
}

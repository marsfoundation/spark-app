import { Token } from '@/domain/types/Token'
import { CommonDialogProps } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { DowngradeDialogContentContainer } from './DowngradeDialogContentContainer'

interface DowngradeDialogProps extends CommonDialogProps {
  fromToken: Token
  toToken: Token
}

export function DowngradeDialog({ fromToken, toToken, open, setOpen }: DowngradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DowngradeDialogContentContainer fromToken={fromToken} toToken={toToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

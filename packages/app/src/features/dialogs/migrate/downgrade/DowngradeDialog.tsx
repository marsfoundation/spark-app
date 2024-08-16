import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps } from '../../common/types'
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

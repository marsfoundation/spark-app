import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { DialogProps } from '../common/types'
import { UpgradeDialogContentContainer } from './UpgradeDialogContentContainer'

interface UpgradeDialogProps extends DialogProps {
  fromToken: Token
  toToken: Token
}

export function UpgradeDialog({ fromToken, toToken, open, setOpen }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <UpgradeDialogContentContainer fromToken={fromToken} toToken={toToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

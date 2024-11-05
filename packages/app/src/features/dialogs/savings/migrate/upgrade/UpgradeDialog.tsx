import { Token } from '@/domain/types/Token'
import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { UpgradeDialogContentContainer } from './UpgradeDialogContentContainer'

interface UpgradeDialogProps extends CommonDialogProps {
  fromToken: Token
  toToken: Token
}

function UpgradeDialog({ fromToken, toToken, open, setOpen }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent spacing="none" preventAutoFocus>
        <UpgradeDialogContentContainer fromToken={fromToken} toToken={toToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const upgradeDialogConfig: DialogConfig<UpgradeDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: UpgradeDialog,
}

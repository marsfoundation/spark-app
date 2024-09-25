import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { StakeDialogContentContainer } from './StakeDialogContentContainer'

export interface StakeDialogProps extends CommonDialogProps {
  farm: Farm
  initialToken: Token
}

function StakeDialog({ initialToken, farm, open, setOpen }: StakeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <StakeDialogContentContainer farm={farm} initialToken={initialToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const stakeDialogConfig: DialogConfig<StakeDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: StakeDialog,
}

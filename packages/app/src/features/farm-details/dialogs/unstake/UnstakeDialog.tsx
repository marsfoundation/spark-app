import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { CommonDialogProps, DialogConfig } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { UnstakeDialogContentContainer } from './UnstakeDialogContentContainer'

export interface StakeDialogProps extends CommonDialogProps {
  farm: Farm
  initialToken: Token
}

function UnstakeDialog({ initialToken, farm, open, setOpen }: StakeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <UnstakeDialogContentContainer farm={farm} initialToken={initialToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const unstakeDialogConfig: DialogConfig<StakeDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: UnstakeDialog,
}

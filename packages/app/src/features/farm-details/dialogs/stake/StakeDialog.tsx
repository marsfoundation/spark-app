import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { CommonDialogProps } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { StakeDialogContentContainer } from './StakeDialogContentContainer'

export interface StakeDialogProps extends CommonDialogProps {
  farm: Farm
  initialToken: Token
}

export function StakeDialog({ initialToken, farm, open, setOpen }: StakeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <StakeDialogContentContainer farm={farm} initialToken={initialToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

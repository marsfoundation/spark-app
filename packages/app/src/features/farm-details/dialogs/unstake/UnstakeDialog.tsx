import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { CommonDialogProps } from '@/features/dialogs/common/types'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { UnstakeDialogContentContainer } from './UnstakeDialogContentContainer'

export interface StakeDialogProps extends CommonDialogProps {
  farm: Farm
  initialToken: Token
}

export function UnstakeDialog({ initialToken, farm, open, setOpen }: StakeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <UnstakeDialogContentContainer farm={farm} initialToken={initialToken} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

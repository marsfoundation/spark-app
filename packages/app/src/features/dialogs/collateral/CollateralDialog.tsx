import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { DialogProps } from '../common/types'
import { CollateralDialogContentContainer } from './CollateralDialogContentContainer'

interface CollateralDialogProps extends DialogProps {
  useAsCollateral: boolean
}

export function CollateralDialog({ token, useAsCollateral, open, setOpen }: CollateralDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <CollateralDialogContentContainer
          useAsCollateral={useAsCollateral}
          token={token}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

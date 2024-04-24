import { MakerInfo } from '@/domain/maker-info/types'
import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../../common/types'
import { SavingsDepositDialogContentContainer } from './SavingsDepositDialogContentContainer'

export interface SavingsDepositDialogProps extends CommonDialogProps {
  initialToken: Token
  makerInfo: MakerInfo
}

export function SavingsDepositDialog({ initialToken, makerInfo, open, setOpen }: SavingsDepositDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SavingsDepositDialogContentContainer
          initialToken={initialToken}
          makerInfo={makerInfo}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

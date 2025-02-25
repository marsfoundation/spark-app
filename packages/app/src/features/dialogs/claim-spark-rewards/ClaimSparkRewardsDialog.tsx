import { Token } from '@/domain/types/Token'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { CommonDialogProps, DialogConfig } from '../common/types'
import { ClaimSparkRewardsDialogContentContainer } from './ClaimSparkRewardsContainer'

export interface ClaimSparkRewardsDialogProps extends CommonDialogProps {
  tokensToClaim: Token[]
}

function ClaimSparkRewardsDialog({ open, setOpen, tokensToClaim }: ClaimSparkRewardsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <ClaimSparkRewardsDialogContentContainer tokensToClaim={tokensToClaim} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const claimRewardsDialogConfig: DialogConfig<ClaimSparkRewardsDialogProps> = {
  options: {
    closeOnChainChange: true,
  },
  element: ClaimSparkRewardsDialog,
}

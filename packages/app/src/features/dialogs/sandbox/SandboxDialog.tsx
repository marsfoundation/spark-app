import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps } from '../common/types'
import { SandboxDialogContentContainer } from './SandboxDialogContentContainer'
import { SandboxMode } from './types'

export interface SandboxDialogProps extends CommonDialogProps {
  mode: SandboxMode
}

export function SandboxDialog({ open, setOpen, mode }: SandboxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SandboxDialogContentContainer mode={mode} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

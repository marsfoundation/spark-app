import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps, DialogConfig } from '../common/types'
import { SandboxDialogContentContainer } from './SandboxDialogContentContainer'
import { SandboxMode } from './types'

export type SandboxDialogProps = { mode: SandboxMode } & CommonDialogProps

function SandboxDialog({ open, setOpen, mode }: SandboxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <SandboxDialogContentContainer mode={mode} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export const sandboxDialogConfig: DialogConfig<SandboxDialogProps> = {
  options: {
    closeOnChainChange: false,
  },
  element: SandboxDialog,
}

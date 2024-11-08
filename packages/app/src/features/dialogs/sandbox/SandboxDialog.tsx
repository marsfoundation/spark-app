import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'

import { CommonDialogProps, DialogConfig } from '../common/types'
import { SandboxDialogContentContainer } from './SandboxDialogContentContainer'
import { SandboxMode } from './types'

export type SandboxDialogProps = { mode: SandboxMode; asDrawer?: boolean } & CommonDialogProps

function SandboxDialog({ open, setOpen, mode, asDrawer = false }: SandboxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent contentVerticalPosition={asDrawer ? 'bottom' : 'center'}>
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

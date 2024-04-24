import { useSandboxDialog } from './logic/useSandboxDialog'
import { SandboxMode } from './types'
import { SandboxDialogView } from './views/SandboxDialogView'

export interface SandboxDialogContentContainerProps {
  mode: SandboxMode
  closeDialog: () => void
}

export function SandboxDialogContentContainer({ mode, closeDialog }: SandboxDialogContentContainerProps) {
  const { isInSandbox, startSandbox, isPending, isSuccess, isError, error } = useSandboxDialog(mode)
  return (
    <SandboxDialogView
      isInSandbox={isInSandbox}
      startSandbox={startSandbox}
      closeDialog={closeDialog}
      isPending={isPending}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  )
}

import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Alert } from '@/ui/molecules/alert/Alert'
import { CheckIcon } from 'lucide-react'

export interface SandboxDialogViewProps {
  isInSandbox: boolean
  startSandbox: () => void
  closeDialog: () => void
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
}

export function SandboxDialogView({
  isInSandbox,
  startSandbox,
  closeDialog,
  isPending,
  isSuccess,
  isError,
  error,
}: SandboxDialogViewProps) {
  const onActionButtonClick = isSuccess || isInSandbox ? closeDialog : startSandbox

  return (
    <div className="flex flex-col gap-5">
      <DialogTitle className="typography-heading-5 flex items-center gap-2 py-2 md:p-0">
        <MagicWand className="icon-sm text-secondary" />
        Sandbox
      </DialogTitle>
      <p className="typography-body-2 text-secondary">
        Sandbox is a risk-free environment where you can test the Spark App and understand how it works. When you're
        ready, you can switch back to the real world. Have fun exploring!
      </p>
      <ul className="flex flex-col gap-2.5">
        {[
          'Unlimited tokens',
          'Risk free exploration',
          'No real assets involved',
          'Fast – no need to sign transactions',
        ].map((item, index) => (
          <li key={index} className="typography-label-2 flex items-center gap-2.5">
            <CheckIcon className="icon-sm icon-system-success-primary" />
            {item}
          </li>
        ))}
      </ul>
      {isError && error && <Alert variant="warning">{error.message}</Alert>}
      <Button loading={isPending} onClick={onActionButtonClick} size="l">
        Activate Sandbox
      </Button>
    </div>
  )
}

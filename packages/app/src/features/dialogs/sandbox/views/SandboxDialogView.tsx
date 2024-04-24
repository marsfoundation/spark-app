import { assets } from '@/ui/assets'
import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { ActionButton } from '@/ui/molecules/action-button/ActionButton'

import { Alert } from '../../common/components/alert/Alert'

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
  const isDone = isSuccess || isInSandbox

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <DialogTitle>
        <div className="flex items-center gap-2">
          <MagicWand className="text-basics-dark-grey h-5 w-5" />
          Sandbox mode
        </div>
      </DialogTitle>
      <p className="text-basics-dark-grey text-sm">
        Sandbox mode is a risk-free environment where you can test the Spark App and understand how it works. When
        you're ready, you can switch back to the real world. Have fun exploring!
      </p>
      <ul className="flex flex-col gap-2.5">
        {[
          'Unlimited tokens',
          'Risk free exploration',
          'No real assets involved',
          'Fast – no need to sign transactions',
        ].map((item, index) => (
          <li key={index} className="text-basics-dark-grey flex items-center gap-2.5 text-sm">
            <img src={assets.success} alt="success-icon" className="h-5" />
            {item}
          </li>
        ))}
      </ul>
      {isError && error && <Alert variant="warning">{error.message}</Alert>}
      <ActionButton isLoading={isPending} onClick={onActionButtonClick} isDone={isDone} variant="primary" size="lg">
        {isDone ? 'Sandbox mode activated' : 'Activate Sandbox mode'}
      </ActionButton>
    </div>
  )
}

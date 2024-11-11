import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { Button, ButtonIcon } from '@/ui/atoms/new/button/Button'

export interface ConnectOrSandboxCTAButtonGroupProps {
  buttonText: string
  action: () => void
  openSandboxModal: () => void
}

export function ConnectOrSandboxCTAButtonGroup({
  action,
  buttonText,
  openSandboxModal,
}: ConnectOrSandboxCTAButtonGroupProps) {
  return (
    <div className="flex gap-3">
      <Button onClick={action}>{buttonText}</Button>
      <Button onClick={openSandboxModal} variant="secondary">
        <ButtonIcon icon={MagicWand} />
        Try in Sandbox Mode
      </Button>
    </div>
  )
}

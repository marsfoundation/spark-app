import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { Button, ButtonIcon } from '@/ui/atoms/new/button/Button'
import { cn } from '@/ui/utils/style'

export interface ConnectOrSandboxCTAButtonGroupProps {
  header?: string
  buttonText: string
  action: () => void
  openSandboxModal: () => void
  className?: string
}

export function ConnectOrSandboxCTAButtonGroup({
  header,
  action,
  buttonText,
  openSandboxModal,
  className,
}: ConnectOrSandboxCTAButtonGroupProps) {
  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <div className="flex flex-col gap-3">
        <h4 className="typography-heading-4 text-center">{header}</h4>
        <Button size="l" onClick={action} variant="secondary">
          {buttonText}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <p className="typography-body-4 text-center text-secondary">or explore in Sandbox Mode with unlimited tokens</p>
        <Button size="l" onClick={openSandboxModal} variant="tertiary">
          <ButtonIcon icon={MagicWand} />
          Activate Sandbox Mode
        </Button>
      </div>
    </div>
  )
}

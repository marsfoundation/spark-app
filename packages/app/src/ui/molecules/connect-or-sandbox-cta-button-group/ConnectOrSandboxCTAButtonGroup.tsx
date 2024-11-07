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
        <h4 className="text-center font-semibold text-base text-basics-black sm:text-xl">{header}</h4>
        <Button onClick={action}>{buttonText}</Button>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-center text-basics-dark-grey text-xs sm:text-base">
          or explore in Sandbox Mode with unlimited tokens
        </p>
        <Button onClick={openSandboxModal} variant="secondary">
          <ButtonIcon icon={MagicWand} />
          Activate Sandbox Mode
        </Button>
      </div>
    </div>
  )
}

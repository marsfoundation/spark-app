import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'

export interface ConnectOrSandboxCTAButtonGroupProps {
  header?: string
  buttonText: string
  action: () => void
  openSandboxModal: () => void
  disabled?: boolean
  className?: string
}

export function ConnectOrSandboxCTAButtonGroup({
  header,
  action,
  buttonText,
  openSandboxModal,
  disabled = false,
  className,
}: ConnectOrSandboxCTAButtonGroupProps) {
  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <div className="flex flex-col gap-3">
        <h4 className="text-center font-semibold text-base text-basics-black sm:text-xl">{header}</h4>
        <Button onClick={action} disabled={disabled}>{buttonText}</Button>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-center text-basics-dark-grey text-xs sm:text-base">
          or explore in Sandbox Mode with unlimited tokens
        </p>
        <Button
          prefixIcon={<MagicWand className="h-5 w-5 text-basics-dark-grey" />}
          onClick={openSandboxModal}
          variant="secondary"
          disabled={disabled}
        >
          Activate Sandbox Mode
        </Button>
      </div>
    </div>
  )
}

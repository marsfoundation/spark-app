import WarningIcon from '@/ui/assets/icons/warning.svg?react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

export interface ErrorWarningProps {
  message: string
  withPrefixIcon?: boolean
  className?: string
}

export function ErrorWarning({ message, withPrefixIcon, className }: ErrorWarningProps) {
  const [errorTextRef, isTruncated] = useIsTruncated()
  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div
          className={cn('typography-body-3 flex min-w-0 flex-shrink-0 items-center gap-0.5 text-secondary', className)}
        >
          {withPrefixIcon && <WarningIcon className="icon-xs text-tertiary" />}
          <div className="truncate" ref={errorTextRef}>
            {message}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{message}</TooltipContent>
    </Tooltip>
  )
}

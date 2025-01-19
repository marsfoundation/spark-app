import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'

export interface ErrorWarningProps {
  message: string
  className?: string
}

export function ErrorWarning({ message, className }: ErrorWarningProps) {
  const [errorTextRef, isTruncated] = useIsTruncated()
  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div className={cn('typography-body-3 flex min-w-0 text-secondary', className)}>
          <div className="truncate" ref={errorTextRef}>
            {message}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{message}</TooltipContent>
    </Tooltip>
  )
}

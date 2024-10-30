import { IconButton, IconButtonProps } from '@/ui/atoms/new/icon-button/IconButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { useClipboard } from '@/utils/useClipboard'
import { useMounted } from '@/utils/useMounted'
import { Check, Copy } from 'lucide-react'
import { forwardRef } from 'react'

export interface CopyButtonProps extends Omit<IconButtonProps, 'children' | 'variant'> {
  text: string
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, onClick, text, ...props }, ref) => {
    const { copied, copy } = useClipboard()
    const isMounted = useMounted()

    function handleCopy(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      copy(text)
      onClick?.(e)
    }

    return (
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <IconButton
            variant="tertiary"
            className={cn('border-none bg-transparent text-secondary shadow-none', className)}
            onClick={handleCopy}
            {...props}
            ref={ref}
          >
            {copied ? (
              <Check className="animate-reveal text-success" />
            ) : (
              // @note it prevents icon from being animated on initial render
              <Copy className={cn(isMounted && 'animate-reveal')} />
            )}
          </IconButton>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={-4}>
          Copied
        </TooltipContent>
      </Tooltip>
    )
  },
)

CopyButton.displayName = 'CopyButton'

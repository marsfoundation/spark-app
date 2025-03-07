import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { useClipboard } from '@/utils/useClipboard'
import { useMounted } from '@/utils/useMounted'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { forwardRef } from 'react'

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, onClick, text, ...props }, ref) => {
    const { copied, copy } = useClipboard()
    const mounted = useMounted()

    async function handleCopy(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
      await copy(text)
      onClick?.(e)
    }

    return (
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy "${text}" to clipboard`}
            className={cn(
              'aspect-square rounded-sm bg-transparent px-2 text-secondary transition-colors',
              'hover:bg-neutral-50 focus-visible:bg-primary active:bg-neutral-100',
              'hover:text-brand-primary focus-visible:text-neutral-950 focus-visible:outline-none',
              'focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
            )}
            ref={ref}
            {...props}
          >
            {copied ? (
              <CheckIcon className="icon-xxs icon-system-success-primary animate-reveal" />
            ) : (
              // @note it prevents icon from being animated on initial render
              <CopyIcon className={cn('icon-xxs', mounted && 'animate-reveal')} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={-4}>
          Copied
        </TooltipContent>
      </Tooltip>
    )
  },
)

CopyButton.displayName = 'CopyButton'

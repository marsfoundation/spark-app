import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { useClipboard } from '@/utils/useClipboard'
import { useMounted } from '@/utils/useMounted'
import { Check, Copy } from 'lucide-react'
import { forwardRef } from 'react'

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy "${text}" to clipboard`}
            className={cn(
              'aspect-square rounded-sm bg-transparent px-2 text-secondary transition-colors',
              'active:bg-reskin-neutral-100 focus-visible:bg-reskin-base-white hover:bg-reskin-neutral-50',
              'focus-visible:text-reskin-neutral-950 hover:text-brand focus-visible:outline-none',
              'focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
            )}
            ref={ref}
            {...props}
          >
            {copied ? (
              <Check size={12} className="animate-reveal text-success" />
            ) : (
              // @note it prevents icon from being animated on initial render
              <Copy size={12} className={cn(isMounted && 'animate-reveal')} />
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

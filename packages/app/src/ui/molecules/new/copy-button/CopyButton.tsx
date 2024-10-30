import { IconButton, IconButtonProps } from '@/ui/atoms/new/icon-button/IconButton'
import { cn } from '@/ui/utils/style'
import { useClipboard } from '@/utils/useClipboard'
import { Check, Copy } from 'lucide-react'
import { forwardRef } from 'react'

export interface CopyButtonProps extends Omit<IconButtonProps, 'children' | 'variant'> {
  text: string
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, onClick, text, ...props }, ref) => {
    const { copied, copy } = useClipboard()

    function handleCopy(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      copy(text)
      onClick?.(e)
    }

    return (
      <IconButton variant="tertiary" className={cn('', className)} onClick={handleCopy} {...props} ref={ref}>
        {copied ? <Check className="text-green-400" /> : <Copy />}
      </IconButton>
    )
  },
)

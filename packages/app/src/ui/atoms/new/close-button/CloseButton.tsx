import { cn } from '@/ui/utils/style'
import { XIcon } from 'lucide-react'
import { forwardRef } from 'react'

export interface CloseButtonProps {
  onClose: () => void
  disabled?: boolean
}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(({ onClose }, ref) => (
  <button
    className={cn(
      'rounded-sm p-2 text-secondary transition-colors',
      'hover:text-reskin-neutral-700',
      'active:text-reskin-neutral-900',
      'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-border-focus',
      'disabled:cursor-not-allowed disabled:text-reskin-neutral-300',
    )}
    onClick={onClose}
    ref={ref}
  >
    <XIcon className="icon-xs" />
  </button>
))
CloseButton.displayName = 'CloseButton'

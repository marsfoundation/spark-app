import { cn } from '@/ui/utils/style'
import { RequiredProps } from '@/utils/types'
import { VariantProps, cva } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import { forwardRef } from 'react'

export interface XButtonProps extends RequiredProps<VariantProps<typeof xButtonVariants>> {
  onClick: () => void
  disabled?: boolean
  className?: string
}

export const XButton = forwardRef<HTMLButtonElement, XButtonProps>(({ onClick, disabled, spacing, className }, ref) => (
  <button className={cn(xButtonVariants({ spacing }), className)} onClick={onClick} ref={ref} disabled={disabled}>
    <XIcon className="icon-xs" />
  </button>
))
XButton.displayName = 'CloseButton'

const xButtonVariants = cva(
  cn(
    'text-secondary transition-colors',
    'hover:text-reskin-neutral-700',
    'active:text-reskin-neutral-900',
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200',
    'disabled:cursor-not-allowed disabled:text-reskin-neutral-300',
  ),
  {
    variants: {
      spacing: {
        none: ' rounded-xxs p-0',
        xs: 'rounded-xs p-1',
        s: 'rounded-sm p-2',
      },
    },
  },
)

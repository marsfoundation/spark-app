import { cn } from '@/ui/utils/style'
import { RequiredProps } from '@/utils/types'
import { VariantProps, cva } from 'class-variance-authority'
import { forwardRef } from 'react'

export interface IconButtonProps extends RequiredProps<VariantProps<typeof iconButtonVariants>> {
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, icon: Icon, disabled, spacing, className }, ref) => (
    <button className={cn(iconButtonVariants({ spacing }), className)} onClick={onClick} ref={ref} disabled={disabled}>
      <Icon className="icon-xs" />
    </button>
  ),
)
IconButton.displayName = 'CloseButton'

const iconButtonVariants = cva(
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

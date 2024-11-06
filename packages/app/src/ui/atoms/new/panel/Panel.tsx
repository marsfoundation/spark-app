import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode, forwardRef } from 'react'

export interface PanelProps extends VariantProps<typeof panelVariants> {
  children?: ReactNode
  className?: string
  'data-testid'?: string
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, 'data-testid': dataTestId, className, spacing, variant, inverse }, ref) => {
    return (
      <div
        className={cn(
          panelVariants({
            spacing,
            variant,
            inverse,
          }),
          className,
        )}
        ref={ref}
        data-testid={dataTestId}
      >
        {children}
      </div>
    )
  },
)
Panel.displayName = 'Panel'

const panelVariants = cva('rounded-sm', {
  variants: {
    variant: {
      primary: 'bg-reskin-base-white text-primary',
      secondary: 'bg-primary text-primary',
      tertiary: 'bg-secondary text-primary',
      quaternary: 'bg-tertiary text-primary',
    },
    spacing: {
      none: 'p-0',
      xs: 'p-1 md:p-3 sm:p-2',
      s: 'p-2 md:p-6 sm:p-3',
      m: 'p-3 md:p-8 sm:p-5',
    },
    inverse: {
      true: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      inverse: true,
      class: 'bg-primary-inverse text-primary-inverse',
    },
    {
      variant: 'secondary',
      inverse: true,
      class: 'bg-reskin-fg-primary text-primary-inverse',
    },
    {
      variant: 'tertiary',
      inverse: true,
      class: 'bg-reskin-fg-secondary text-primary-inverse',
    },
    {
      variant: 'quaternary',
      inverse: true,
      class: 'bg-reskin-fg-tertiary text-primary-inverse',
    },
  ],
  defaultVariants: {
    variant: 'primary',
  },
})

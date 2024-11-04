import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode, forwardRef } from 'react'

export interface PanelProps extends VariantProps<typeof panelVariants> {
  children?: ReactNode
  className?: string
  'data-testid'?: string
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, 'data-testid': dataTestId, className, ...variants }, ref) => {
    return (
      <div className={cn(panelVariants(variants), className)} ref={ref} data-testid={dataTestId}>
        {children}
      </div>
    )
  },
)
Panel.displayName = 'Panel'

const panelVariants = cva('rounded-sm', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary',
      secondary: 'bg-primary-inverse text-primary-inverse',
      tertiary: 'bg-tertiary text-primary',
      quaternary: 'bg-reskin-fg-primary text-primary-inverse',
    },
    spacing: {
      none: 'p-0',
      xs: 'p-1 md:p-3 sm:p-2',
      s: 'p-2 md:p-6 sm:p-3',
      m: 'p-3 md:p-8 sm:p-5',
    },
  },
})

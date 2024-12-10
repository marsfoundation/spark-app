import { cn } from '@/ui/utils/style'
import { RequiredProps } from '@/utils/types'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentType, ReactNode, createContext, forwardRef, useContext } from 'react'

export interface BadgeProps extends RequiredProps<VariantProps<typeof badgeVariants>> {
  children?: ReactNode
  className?: string
  'data-testid'?: string
}

interface BadgeContext {
  size: NonNullable<VariantProps<typeof badgeVariants>['size']>
}
const BadgeContext = createContext<BadgeContext | null>(null)
function useBadgeContext(): BadgeContext {
  const context = useContext(BadgeContext)
  if (!context) {
    throw new Error('useBadeContext must be used within a Badge')
  }
  return context
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, 'data-testid': dataTestId, className, ...variants }, ref) => {
    return (
      <div className={cn(badgeVariants(variants), className)} ref={ref} data-testid={dataTestId}>
        <BadgeContext.Provider value={{ size: variants.size }}>{children}</BadgeContext.Provider>
      </div>
    )
  },
)
Badge.displayName = 'Badge'

const badgeVariants = cva('typography-label-3 inline-flex w-fit items-center gap-1 rounded-full', {
  variants: {
    appearance: {
      soft: '',
      solid: '',
    },
    variant: {
      brand: '',
      success: '',
      warning: '',
      error: '',
      neutral: '',
    },
    size: {
      xs: 'px-1.5 py-1',
      sm: 'px-2.5 py-2',
    },
  },
  compoundVariants: [
    { appearance: 'soft', variant: 'brand', class: 'bg-brand-secondary text-brand-primary' },
    { appearance: 'soft', variant: 'success', class: 'bg-system-success-primary text-system-success-primary' },
    { appearance: 'soft', variant: 'warning', class: 'bg-system-warning-primary text-system-warning-primary' },
    { appearance: 'soft', variant: 'error', class: 'bg-system-error-primary text-system-error-primary' },
    { appearance: 'soft', variant: 'neutral', class: 'bg-secondary text-secondary' },
    { appearance: 'solid', variant: 'brand', class: 'bg-fg-brand-tertiary text-primary-inverse' },
    { appearance: 'solid', variant: 'success', class: 'bg-fg-system-success-secondary text-primary-inverse' },
    { appearance: 'solid', variant: 'warning', class: 'bg-fg-system-warning-secondary text-primary-inverse' },
    { appearance: 'solid', variant: 'error', class: 'bg-fg-system-error-secondary text-primary-inverse' },
    { appearance: 'solid', variant: 'neutral', class: 'bg-fg-quaternary text-primary-inverse' },
  ],
})

const badgeIconVariants = cva('', {
  variants: {
    size: {
      xs: 'icon-xs',
      sm: 'icon-xs',
    },
  },
})

export function BadgeIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  const { size } = useBadgeContext()
  return <Icon className={badgeIconVariants({ size })} />
}

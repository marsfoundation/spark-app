import { IconBox } from '@/ui/atoms/icon-box/IconBox'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { type VariantProps, cva } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import { ReactNode, forwardRef, useState } from 'react'

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode
  variant: NonNullable<VariantProps<typeof alertVariants>['variant']>
  className?: string
  'data-testid'?: string
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant, closable = false, children, className, 'data-testid': dataTestId }, ref) => {
    const [visible, setVisible] = useState(true)

    if (!visible) {
      return null
    }

    return (
      <div className={cn(alertVariants({ variant, closable }), className)} ref={ref} data-testid={dataTestId}>
        <IconBox variant={variant} size="s" />
        <div data-testid={testIds.component.Alert.message}>{children}</div>
        {closable && <IconButton icon={XIcon} onClick={() => setVisible(false)} variant="transparent" size="m" />}
      </div>
    )
  },
)
Alert.displayName = 'Alert'

const alertVariants = cva('typography-label-6 grid grid-cols-[auto_1fr] items-center gap-3 rounded-sm p-4', {
  variants: {
    variant: {
      info: 'bg-brand-primary text-brand-primary',
      warning: 'bg-system-warning-primary text-system-warning-primary',
      error: 'bg-system-error-primary text-system-error-primary',
    },
    closable: {
      true: 'grid-cols-[auto_1fr_auto]',
    },
  },
})

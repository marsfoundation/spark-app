import { IconBox } from '@/ui/atoms/new/icon-box/IconBox'
import { XButton } from '@/ui/atoms/new/x-button/XButton'
import { assertNever } from '@/utils/assertNever'
import { type VariantProps, cva } from 'class-variance-authority'
import { ReactNode, forwardRef, useState } from 'react'

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode
  variant: NonNullable<VariantProps<typeof alertVariants>['variant']>
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({ variant, closable = false, children }, ref) => {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  switch (variant) {
    case 'info':
      return (
        <div className={alertVariants({ variant, closable })} ref={ref}>
          <IconBox variant="info" size="s" />
          {children}
          {closable && <XButton onClick={() => setVisible(false)} spacing="s" />}
        </div>
      )
    case 'warning':
      return (
        <div className={alertVariants({ variant, closable })} ref={ref}>
          <IconBox variant="warning" size="s" />
          {children}
          {closable && <XButton onClick={() => setVisible(false)} spacing="s" />}
        </div>
      )
    case 'error':
      return (
        <div className={alertVariants({ variant, closable })} ref={ref}>
          <IconBox variant="error" size="s" />
          {children}
          {closable && <XButton onClick={() => setVisible(false)} spacing="s" />}
        </div>
      )
    default:
      assertNever(variant)
  }
})
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

import { assertNever } from '@/utils/assertNever'
import { RequiredProps } from '@/utils/types'
import { type VariantProps, cva } from 'class-variance-authority'
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react'

export interface IconBoxProps extends RequiredProps<VariantProps<typeof iconBoxVariants>> {}

export function IconBox({ variant, size }: IconBoxProps) {
  switch (variant) {
    case 'success':
      return (
        <div className={iconBoxVariants({ variant, size })}>
          <CheckCircle2Icon className="h-full w-full" />
        </div>
      )
    case 'warning':
      return (
        <div className={iconBoxVariants({ variant, size })}>
          <AlertTriangleIcon className="h-full w-full" />
        </div>
      )
    case 'info':
      return (
        <div className={iconBoxVariants({ variant, size })}>
          <InfoIcon className="h-full w-full" />
        </div>
      )
    case 'error':
      return (
        <div className={iconBoxVariants({ variant, size })}>
          <AlertTriangleIcon className="h-full w-full" />
        </div>
      )
    default:
      assertNever(variant)
  }
}

export const iconBoxVariants = cva('inline-flex items-center justify-center rounded-full', {
  variants: {
    variant: {
      success: 'bg-reskin-fg-system-success-secondary text-white',
      warning: 'bg-reskin-fg-system-warning-primary text-white',
      info: 'bg-reskin-border-focus text-brand',
      error: 'bg-reskin-fg-system-error-secondary text-white',
    },
    size: {
      xl: 'h-[120px] w-[120px] p-6',
      s: 'h-6 w-6 p-1',
      xs: 'h-4 w-4 p-0.5',
    },
  },
})
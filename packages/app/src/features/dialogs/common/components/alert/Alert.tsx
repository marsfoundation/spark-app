import { cva } from 'class-variance-authority'
import { AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type VariantsConfig = {
  variant: { danger: string; warning: string; info: string }
  size: { normal: string; small: string }
}
type Variant = keyof VariantsConfig['variant']
type Size = keyof VariantsConfig['size']

interface AlertProps {
  children: ReactNode
  variant: Variant
  size?: Size
  className?: string
  'data-testid'?: string
}

export function Alert({ children, variant, size = 'normal', className, 'data-testid': dataTestId }: AlertProps) {
  return (
    <div className={cn(bgVariants({ variant, size }), className)} data-testid={dataTestId}>
      <AlertTriangle className={iconVariants({ variant, size })} />
      <p data-testid={testIds.component.Alert.message} className="text-xs">
        {children}
      </p>
    </div>
  )
}

const bgVariants = cva<VariantsConfig>('flex items-center', {
  variants: {
    variant: {
      danger: 'bg-[#FC5038]/10',
      warning: 'bg-[#F4B731]/10',
      info: 'bg-[#3F66EF]/10',
    },
    size: {
      normal: 'gap-4 rounded-lg px-4 py-2.5',
      small: 'w-fit gap-2 rounded-lg px-2 py-1',
    },
  },
})

const iconVariants = cva<VariantsConfig>('shrink-0', {
  variants: {
    variant: {
      danger: 'text-[#FC4F37]',
      warning: 'text-[#F4B731]',
      info: 'text-main-blue',
    },
    size: {
      normal: 'h-6 w-6',
      small: 'h-4 w-4',
    },
  },
})

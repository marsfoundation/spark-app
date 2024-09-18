import { cva } from 'class-variance-authority'
import { AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

interface VariantsConfig {
  variant: { danger: string; warning: string; info: string }
}
type Variant = keyof VariantsConfig['variant']

interface AlertProps {
  children: ReactNode
  variant: Variant
  className?: string
  'data-testid'?: string
}

export function Alert({ children, variant, className, 'data-testid': dataTestId }: AlertProps) {
  return (
    <div className={cn(bgVariants({ variant }), className)} data-testid={dataTestId}>
      <AlertTriangle className={iconVariants({ variant })} />
      <p data-testid={testIds.component.Alert.message} className="text-basics-black text-xs">
        {children}
      </p>
    </div>
  )
}

const bgVariants = cva('flex items-center gap-4 rounded-lg px-4 py-2.5', {
  variants: {
    variant: {
      danger: 'bg-[#FC5038]/10',
      warning: 'bg-[#F4B731]/10',
      info: 'bg-[#3F66EF]/10',
    },
  },
})

const iconVariants = cva('h-6 shrink-0', {
  variants: {
    variant: {
      danger: 'text-[#FC4F37]',
      warning: 'text-[#F4B731]',
      info: 'text-main-blue',
    },
  },
})

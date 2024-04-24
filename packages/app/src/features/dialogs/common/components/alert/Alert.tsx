import { cva } from 'class-variance-authority'
import { AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

import { testIds } from '@/ui/utils/testIds'

type VariantsConfig = { variant: { danger: string; warning: string; info: string } }
type Variant = keyof VariantsConfig['variant']

interface AlertProps {
  children: ReactNode
  variant: Variant
}

export function Alert({ children, variant }: AlertProps) {
  return (
    <div className={bgVariants({ variant })}>
      <AlertTriangle className={iconVariants({ variant })} />
      <p data-testid={testIds.component.Alert.message} className="text-basics-black text-xs">
        {children}
      </p>
    </div>
  )
}

const bgVariants = cva<VariantsConfig>('flex items-center gap-4 rounded-lg px-4 py-2.5', {
  variants: {
    variant: {
      danger: 'bg-[#FC5038]/10',
      warning: 'bg-[#F4B731]/10',
      info: 'bg-[#3F66EF]/10',
    },
  },
})

const iconVariants = cva<VariantsConfig>('h-6 shrink-0', {
  variants: {
    variant: {
      danger: 'text-[#FC4F37]',
      warning: 'text-[#F4B731]',
      info: 'text-main-blue',
    },
  },
})

import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'

interface SlippageButtonProps {
  children: ReactNode
  isActive: boolean
}

export function SlippageButton({ children, isActive }: SlippageButtonProps) {
  return (
    <button
      className={cn(
        'flex h-[56px] w-[60px] items-center justify-center',
        'border-basics-border rounded-xl border bg-white',
        'hover:bg-basics-light-grey transition-colors duration-200',
        'text-basics-dark-grey hover:shadow-sm',
        isActive && 'border-main-blue text-basics-black',
      )}
    >
      {children}
    </button>
  )
}

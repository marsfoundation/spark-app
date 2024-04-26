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
        'flex h-[46px] w-[50px] flex-shrink-0 items-center justify-center sm:h-[56px] sm:w-[60px]',
        'border-basics-border rounded-xl border bg-white text-sm sm:text-base',
        'hover:bg-basics-light-grey transition-colors duration-200',
        'text-basics-dark-grey hover:shadow-sm',
        isActive && 'border-main-blue text-basics-black',
      )}
    >
      {children}
    </button>
  )
}

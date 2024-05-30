import { HTMLAttributes } from 'react'

import { cn } from '@/ui/utils/style'

interface SlippageButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isActive: boolean
}

export function SlippageButton({ children, isActive, ...rest }: SlippageButtonProps) {
  return (
    <button
      className={cn(
        'flex h-[46px] w-[50px] flex-shrink-0 items-center justify-center sm:h-[56px] sm:w-[60px]',
        'rounded-xl border border-basics-border bg-white text-sm sm:text-base',
        'transition-colors duration-200 hover:bg-basics-light-grey',
        'text-basics-dark-grey hover:shadow-sm',
        isActive && 'border-main-blue text-basics-black',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

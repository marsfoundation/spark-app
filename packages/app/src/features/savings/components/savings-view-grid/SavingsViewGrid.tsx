import { cn } from '@/ui/utils/style'
import { Children, ReactNode } from 'react'

export function SavingsViewGrid({ children }: { children: ReactNode[] }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:grid lg:min-h-[384px] md:min-h-72 ',
        Children.toArray(children).length > 1 && 'md:grid-cols-2',
      )}
    >
      {children}
    </div>
  )
}

import { cn } from '@/ui/utils/style'
import { Children, ReactNode } from 'react'

export function SavingsViewGrid({ children }: { children: ReactNode[] }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:grid sm:min-h-[384px] ',
        Children.toArray(children).length > 1 && 'sm:grid-cols-2',
      )}
    >
      {children}
    </div>
  )
}

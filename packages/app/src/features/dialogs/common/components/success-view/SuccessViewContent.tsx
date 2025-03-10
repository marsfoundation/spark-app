import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ReactNode } from 'react'

interface SuccessViewContentProps {
  children: ReactNode
  className?: string
}

export function SuccessViewContent({ children, className }: SuccessViewContentProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center', className)}
      data-testid={testIds.component.SuccessView.content}
    >
      {children}
    </div>
  )
}

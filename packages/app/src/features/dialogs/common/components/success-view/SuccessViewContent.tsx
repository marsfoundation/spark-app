import { testIds } from '@/ui/utils/testIds'
import { ReactNode } from 'react'

interface SuccessViewContentProps {
  children: ReactNode
}

export function SuccessViewContent({ children }: SuccessViewContentProps) {
  return (
    <div className="flex flex-col items-center justify-center" data-testid={testIds.component.SuccessViewContent}>
      {children}
    </div>
  )
}

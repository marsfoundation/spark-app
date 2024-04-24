import { ReactNode } from 'react'

import { Button } from '@/ui/atoms/button/Button'

interface SuccessViewProceedButtonProps {
  onProceed: () => void
  children: ReactNode
}

export function SuccessViewProceedButton({ onProceed, children }: SuccessViewProceedButtonProps) {
  return (
    <Button className="mt-4 w-full" onClick={onProceed}>
      {children}
    </Button>
  )
}

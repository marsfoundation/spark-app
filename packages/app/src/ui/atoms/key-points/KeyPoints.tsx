import { cn } from '@/ui/utils/style'
import { CheckIcon, XIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface KeyPointsProps {
  children: ReactNode
  className?: string
}
export function KeyPoints({ children, className }: KeyPointsProps) {
  return <ul className={cn('flex flex-col gap-2.5', className)}>{children}</ul>
}

function KeyPointsItem({ children, variant }: { children: ReactNode; variant: 'positive' | 'negative' }) {
  return (
    <li className="typography-label-2 flex items-center gap-2.5">
      {variant === 'positive' && <CheckIcon className="icon-xs text-system-success-primary" />}
      {variant === 'negative' && <XIcon className="icon-xs text-system-error-primary" />}
      {children}
    </li>
  )
}

KeyPoints.Item = KeyPointsItem

import { assets } from '@/ui/assets'
import { ReactNode } from 'react'

export interface KeyPointsProps {
  children: ReactNode
}
export function KeyPoints({ children }: KeyPointsProps) {
  return <ul className="flex flex-col gap-2.5">{children}</ul>
}

function KeyPointsItem({ children, variant }: { children: ReactNode; variant: 'positive' | 'negative' }) {
  return (
    <li className="flex items-center gap-2.5 text-basics-blacks">
      {variant === 'positive' && <img src={assets.success} alt="positive-checkmark-icon" className="h-5" />}
      {variant === 'negative' && <img src={assets.closeFilled} alt="negative-cross-icon" className="h-5" />}
      {children}
    </li>
  )
}

KeyPoints.Item = KeyPointsItem

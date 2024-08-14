import { assets } from '@/ui/assets'
import { ReactNode } from 'react'

export interface BenefitsProps {
  children: ReactNode[]
}
export function Benefits({ children }: BenefitsProps) {
  return <ul className="flex flex-col gap-2.5">{children}</ul>
}

function BenefitsItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-basics-dark-grey text-sm">
      <img src={assets.success} alt="success-icon" className="h-5" />
      {children}
    </li>
  )
}

Benefits.Item = BenefitsItem

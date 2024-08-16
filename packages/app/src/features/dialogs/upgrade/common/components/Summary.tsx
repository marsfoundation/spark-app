import { ReactNode } from 'react'

export interface SummaryProps {
  children: ReactNode
}
export function Summary({ children }: SummaryProps) {
  return <div className="font-light text-basics-dark-grey leading-snug">{children}</div>
}

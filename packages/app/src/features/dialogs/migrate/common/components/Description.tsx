import { ReactNode } from 'react'

export interface SummaryProps {
  children: ReactNode
}
export function Description({ children }: SummaryProps) {
  return <div className="text-basics-dark-grey leading-snug">{children}</div>
}

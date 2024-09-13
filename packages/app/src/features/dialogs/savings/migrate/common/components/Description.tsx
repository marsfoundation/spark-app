import { ReactNode } from 'react'

export interface SummaryProps {
  children: ReactNode
}
export function Description({ children }: SummaryProps) {
  return <div className="mb-2 text-basics-dark-grey text-sm leading-snug">{children}</div>
}

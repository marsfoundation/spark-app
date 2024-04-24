import { ReactNode } from 'react'

interface DetailsGridProps {
  children: ReactNode
}
export function DetailsGrid({ children }: DetailsGridProps) {
  return <div className="grid gap-y-5 sm:grid-cols-2">{children}</div>
}

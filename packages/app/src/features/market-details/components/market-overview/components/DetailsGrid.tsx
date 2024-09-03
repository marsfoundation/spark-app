import { ReactNode } from 'react'

interface DetailsGridProps {
  children: ReactNode
}
export function DetailsGrid({ children }: DetailsGridProps) {
  return <div className="grid gap-y-2 sm:grid-cols-2 sm:gap-y-5">{children}</div>
}

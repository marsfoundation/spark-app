import { ReactNode } from 'react'

export interface TransactionOverviewDetailsItemProps {
  label: string
  children: ReactNode
}

export function TransactionOverviewDetailsItem({ label, children }: TransactionOverviewDetailsItemProps) {
  return (
    <div className="flex justify-between border-b py-4 last:border-0 last:pb-0">
      <div>{label}</div>
      <div className="flex flex-col items-end gap-3.5">{children}</div>
    </div>
  )
}

import { ReactNode } from 'react'

interface FormAndOverviewWrapperProps {
  children: ReactNode
}

export function FormAndOverviewWrapper({ children }: FormAndOverviewWrapperProps) {
  return <div className="flex flex-col gap-2">{children}</div>
}

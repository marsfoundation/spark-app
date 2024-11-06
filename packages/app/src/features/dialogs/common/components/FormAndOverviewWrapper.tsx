import { ReactNode } from 'react'

interface FormAndOverviewWrapperProps {
  children: ReactNode
}

export function FormAndOverviewWrapper({ children }: FormAndOverviewWrapperProps) {
  return <div className="flex flex-col gap-2 sm:gap-6">{children}</div>
}

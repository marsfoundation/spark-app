import { ReactNode } from 'react'

interface StatusPanelGridProps {
  children: ReactNode
}

export function StatusPanelGrid({ children }: StatusPanelGridProps) {
  return (
    <div className="grid grid-cols-[min-content_1fr_auto] items-center gap-x-2.5 p-4 sm:gap-x-5 sm:px-8 sm:py-6">
      {children}
    </div>
  )
}

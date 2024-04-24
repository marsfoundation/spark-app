import { ReactNode } from 'react'

interface ActionViewWrapperProps {
  children: ReactNode
}

export function MultiPanelDialog({ children }: ActionViewWrapperProps) {
  return <div className="flex max-w-xl flex-col gap-4">{children}</div>
}

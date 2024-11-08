import { Panel } from '@/ui/atoms/new/panel/Panel'
import { ReactNode } from 'react'

interface StatusPanelGridProps {
  children: ReactNode
}

export function StatusPanelGrid({ children }: StatusPanelGridProps) {
  return <Panel className="grid grid-cols-[min-content_1fr_auto] items-center gap-x-2.5 sm:gap-x-5">{children}</Panel>
}
